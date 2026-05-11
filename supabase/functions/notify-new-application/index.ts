import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ADMIN_EMAIL = "info@etanche.com";
const ADMIN_URL = "https://equation-roof-pro.lovable.app/admin/candidatures";
const FROM = "EQUATION Recrutement <recrutement@send.digitori.fr>";

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

    const html = `<!DOCTYPE html><html lang="fr"><body style="margin:0;padding:0;background:#f7f4f0;font-family:'Helvetica Neue',Arial,sans-serif;color:#1a1a1a;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f4f0;padding:32px 16px;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:600px;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
<tr><td style="background:#971C30;padding:28px;text-align:center;">
<h1 style="margin:0;color:#ffffff;font-size:24px;font-family:'Georgia',serif;letter-spacing:1px;">EQUATION</h1>
<p style="margin:8px 0 0;color:#ffffff;font-size:13px;opacity:0.9;text-transform:uppercase;letter-spacing:1.5px;">Nouvelle candidature reçue</p></td></tr>
<tr><td style="padding:32px 28px;">
<p style="margin:0 0 20px;font-size:15px;">Bonjour Thierry,</p>
<p style="margin:0 0 24px;font-size:15px;line-height:1.6;">Une nouvelle candidature vient d'être déposée sur le site EQUATION.</p>
<h2 style="margin:24px 0 12px;font-size:15px;color:#971C30;border-bottom:2px solid #971C30;padding-bottom:6px;text-transform:uppercase;letter-spacing:1px;">Informations candidat</h2>
<table cellpadding="6" cellspacing="0" style="width:100%;font-size:14px;">
<tr><td style="color:#6b6b6b;width:140px;">Nom complet</td><td style="color:#1a1a1a;font-weight:600;">${escapeHtml(app.full_name)}</td></tr>
<tr><td style="color:#6b6b6b;">Email</td><td><a href="mailto:${escapeHtml(app.email)}" style="color:#971C30;">${escapeHtml(app.email)}</a></td></tr>
<tr><td style="color:#6b6b6b;">Téléphone</td><td><a href="tel:${escapeHtml(app.phone)}" style="color:#971C30;">${escapeHtml(app.phone)}</a></td></tr>
<tr><td style="color:#6b6b6b;">Poste</td><td>${escapeHtml(app.position || "Candidature spontanée")}</td></tr>
<tr><td style="color:#6b6b6b;">Date</td><td>${dateFr}</td></tr></table>
<h2 style="margin:28px 0 12px;font-size:15px;color:#971C30;border-bottom:2px solid #971C30;padding-bottom:6px;text-transform:uppercase;letter-spacing:1px;">Message</h2>
<div style="background:#f7f4f0;padding:16px;border-radius:8px;font-size:14px;line-height:1.6;white-space:pre-wrap;color:#1a1a1a;">${escapeHtml(app.message)}</div>
${attachments.length ? `<p style="margin-top:24px;font-size:13px;color:#971C30;"><strong>📎 CV joint à ce mail :</strong> ${escapeHtml(app.cv_filename || "")}</p>` : ""}
<table cellpadding="0" cellspacing="0" style="margin-top:32px;"><tr><td style="background:#971C30;border-radius:6px;">
<a href="${ADMIN_URL}" style="display:inline-block;padding:13px 26px;color:#ffffff;font-weight:600;text-decoration:none;font-size:14px;">→ Voir dans mon administration</a>
</td></tr></table>
<p style="margin:32px 0 0;font-size:12px;color:#999;border-top:1px solid #eee;padding-top:16px;">Email automatique du site EQUATION.</p>
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

    // Accusé de réception au candidat (best-effort, n'échoue pas si erreur)
    try {
      const firstName = (app.full_name || "").trim().split(/\s+/)[0] || "";
      const confirmHtml = `<!DOCTYPE html><html lang="fr"><body style="margin:0;padding:0;background:#f7f4f0;font-family:'Helvetica Neue',Arial,sans-serif;color:#1a1a1a;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f4f0;padding:32px 16px;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:600px;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
<tr><td style="background:#971C30;padding:28px;text-align:center;">
<h1 style="margin:0;color:#ffffff;font-size:24px;font-family:'Georgia',serif;letter-spacing:1px;">EQUATION</h1>
<p style="margin:8px 0 0;color:#ffffff;font-size:13px;opacity:0.9;text-transform:uppercase;letter-spacing:1.5px;">Candidature bien reçue</p></td></tr>
<tr><td style="padding:36px 32px;font-size:15px;line-height:1.7;">
<p style="margin:0 0 18px;">Bonjour ${escapeHtml(firstName)},</p>
<p style="margin:0 0 18px;">Nous avons bien reçu votre candidature${app.position ? ` pour le poste de <strong style="color:#971C30;">${escapeHtml(app.position)}</strong>` : ""} et vous remercions de l'intérêt que vous portez à EQUATION.</p>
<p style="margin:0 0 18px;">Notre équipe va l'étudier avec attention et reviendra vers vous sous <strong style="color:#971C30;">48h ouvrées</strong>.</p>
<p style="margin:28px 0 0;">À très bientôt,<br/><strong>L'équipe EQUATION</strong></p>
<div style="margin:32px 0 0;padding:18px 0 0;border-top:2px solid #971C30;font-size:13px;color:#6b6b6b;line-height:1.6;">
<strong style="color:#971C30;">EQUATION</strong> — Étanchéité &amp; Couverture<br/>
📞 04 73 87 53 50 &nbsp;·&nbsp; ✉ info@etanche.com</div>
</td></tr></table></td></tr></table></body></html>`;

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: FROM,
          to: [app.email],
          reply_to: ADMIN_EMAIL,
          subject: "Votre candidature a bien été reçue — EQUATION",
          html: confirmHtml,
        }),
      });
    } catch (e) {
      console.warn("Confirmation candidat échouée:", e);
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
