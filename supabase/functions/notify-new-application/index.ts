import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ADMIN_EMAIL = "info@etanche.com";
const ADMIN_URL = "https://equation-roof-pro.lovable.app/admin/candidatures";
const FROM = "EQUATION Recrutement <onboarding@resend.dev>";

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY missing");

    const { applicationId } = await req.json();
    if (!applicationId) {
      return new Response(JSON.stringify({ error: "applicationId required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: app, error } = await supabase
      .from("job_applications").select("*").eq("id", applicationId).single();
    if (error || !app) {
      return new Response(JSON.stringify({ error: "Application not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Download CV from storage as base64 attachment
    let attachments: Array<{ filename: string; content: string }> = [];
    if (app.cv_url) {
      const { data: fileBlob, error: dlErr } = await supabase.storage
        .from("cv-candidats").download(app.cv_url);
      if (dlErr) {
        console.warn("CV download failed:", dlErr);
      } else if (fileBlob) {
        const buf = new Uint8Array(await fileBlob.arrayBuffer());
        let bin = "";
        for (let i = 0; i < buf.length; i++) bin += String.fromCharCode(buf[i]);
        const b64 = btoa(bin);
        attachments.push({ filename: app.cv_filename || "cv.pdf", content: b64 });
      }
    }

    const dateFr = new Date(app.created_at).toLocaleDateString("fr-FR", {
      day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
    });

    const html = `<!DOCTYPE html><html lang="fr"><body style="margin:0;padding:0;background:#f5f3ee;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:#1B3A5C;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f3ee;padding:32px 16px;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:600px;">
<tr><td style="background:#1B3A5C;padding:24px;text-align:center;">
<h1 style="margin:0;color:#E8A624;font-size:22px;">EQUATION</h1>
<p style="margin:6px 0 0;color:#fff;font-size:13px;opacity:0.9;">Nouvelle candidature reçue</p></td></tr>
<tr><td style="padding:32px 28px;">
<p style="margin:0 0 20px;font-size:15px;">Bonjour Thierry,</p>
<p style="margin:0 0 24px;font-size:15px;">Une nouvelle candidature vient d'être déposée sur le site EQUATION.</p>
<h2 style="margin:24px 0 12px;font-size:16px;color:#1B3A5C;border-bottom:2px solid #E8A624;padding-bottom:6px;">Informations candidat</h2>
<table cellpadding="6" cellspacing="0" style="width:100%;font-size:14px;">
<tr><td style="color:#666;width:140px;">Nom complet</td><td style="color:#1B3A5C;font-weight:600;">${escapeHtml(app.full_name)}</td></tr>
<tr><td style="color:#666;">Email</td><td><a href="mailto:${escapeHtml(app.email)}" style="color:#2C8C6F;">${escapeHtml(app.email)}</a></td></tr>
<tr><td style="color:#666;">Téléphone</td><td><a href="tel:${escapeHtml(app.phone)}" style="color:#2C8C6F;">${escapeHtml(app.phone)}</a></td></tr>
<tr><td style="color:#666;">Poste</td><td>${escapeHtml(app.position || "Candidature spontanée")}</td></tr>
<tr><td style="color:#666;">Date</td><td>${dateFr}</td></tr></table>
<h2 style="margin:28px 0 12px;font-size:16px;color:#1B3A5C;border-bottom:2px solid #E8A624;padding-bottom:6px;">Message</h2>
<div style="background:#f5f3ee;padding:16px;border-radius:8px;font-size:14px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(app.message)}</div>
${attachments.length ? `<p style="margin-top:24px;font-size:13px;color:#2C8C6F;"><strong>📎 CV joint à ce mail :</strong> ${escapeHtml(app.cv_filename || "")}</p>` : ""}
<table cellpadding="0" cellspacing="0" style="margin-top:32px;"><tr><td style="background:#1B3A5C;border-radius:6px;">
<a href="${ADMIN_URL}" style="display:inline-block;padding:12px 24px;color:#fff;font-weight:600;text-decoration:none;font-size:14px;">→ Voir dans mon administration</a>
</td></tr></table>
<p style="margin:32px 0 0;font-size:13px;color:#999;border-top:1px solid #eee;padding-top:16px;">Email automatique du site EQUATION.</p>
</td></tr></table></td></tr></table></body></html>`;

    const subject = `🎯 Nouvelle candidature - ${app.position || "Spontanée"} - ${app.full_name}`;

    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM,
        to: [ADMIN_EMAIL],
        reply_to: app.email,
        subject,
        html,
        attachments,
      }),
    });

    const result = await resp.json();
    if (!resp.ok) {
      console.error("Resend error:", result);
      return new Response(JSON.stringify({ error: result }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true, id: result.id }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("notify-new-application error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
