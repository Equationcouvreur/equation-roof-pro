import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ADMIN_EMAIL = "info@etanche.com";
const ADMIN_URL = "https://equation-roof-pro.lovable.app/admin/candidatures";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { applicationId } = await req.json();
    if (!applicationId || typeof applicationId !== "string") {
      return new Response(JSON.stringify({ error: "applicationId required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: app, error } = await supabase
      .from("job_applications")
      .select("*")
      .eq("id", applicationId)
      .single();

    if (error || !app) {
      console.error("Application not found:", error);
      return new Response(JSON.stringify({ error: "Application not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let cvSignedUrl: string | null = null;
    if (app.cv_url) {
      const { data: signed } = await supabase.storage
        .from("cv-candidats")
        .createSignedUrl(app.cv_url, 60 * 60 * 24 * 30); // 30 jours
      cvSignedUrl = signed?.signedUrl || null;
    }

    const dateFr = new Date(app.created_at).toLocaleDateString("fr-FR", {
      day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
    });

    const html = `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f5f3ee;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:#1B3A5C;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f3ee;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:600px;">
        <tr><td style="background:#1B3A5C;padding:24px;text-align:center;">
          <h1 style="margin:0;color:#E8A624;font-size:22px;font-weight:bold;">EQUATION</h1>
          <p style="margin:6px 0 0;color:#ffffff;font-size:13px;opacity:0.9;">Nouvelle candidature reçue</p>
        </td></tr>
        <tr><td style="padding:32px 28px;">
          <p style="margin:0 0 20px;font-size:15px;">Bonjour Thierry,</p>
          <p style="margin:0 0 24px;font-size:15px;line-height:1.6;">
            Une nouvelle candidature vient d'être déposée sur le site EQUATION.
          </p>

          <h2 style="margin:24px 0 12px;font-size:16px;color:#1B3A5C;border-bottom:2px solid #E8A624;padding-bottom:6px;">📋 Informations candidat</h2>
          <table cellpadding="6" cellspacing="0" style="width:100%;font-size:14px;">
            <tr><td style="color:#666;width:140px;">Nom complet</td><td style="color:#1B3A5C;font-weight:600;">${escapeHtml(app.full_name)}</td></tr>
            <tr><td style="color:#666;">Email</td><td><a href="mailto:${escapeHtml(app.email)}" style="color:#2C8C6F;">${escapeHtml(app.email)}</a></td></tr>
            <tr><td style="color:#666;">Téléphone</td><td><a href="tel:${escapeHtml(app.phone)}" style="color:#2C8C6F;">${escapeHtml(app.phone)}</a></td></tr>
            <tr><td style="color:#666;">Poste</td><td style="color:#1B3A5C;">${escapeHtml(app.position || "Candidature spontanée")}</td></tr>
            <tr><td style="color:#666;">Date</td><td style="color:#1B3A5C;">${dateFr}</td></tr>
          </table>

          <h2 style="margin:28px 0 12px;font-size:16px;color:#1B3A5C;border-bottom:2px solid #E8A624;padding-bottom:6px;">💬 Message</h2>
          <div style="background:#f5f3ee;padding:16px;border-radius:8px;font-size:14px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(app.message)}</div>

          ${cvSignedUrl ? `
          <h2 style="margin:28px 0 12px;font-size:16px;color:#1B3A5C;border-bottom:2px solid #E8A624;padding-bottom:6px;">📎 CV du candidat</h2>
          <p style="margin:0 0 16px;font-size:13px;color:#666;">${escapeHtml(app.cv_filename || "CV")}</p>
          <table cellpadding="0" cellspacing="0"><tr><td style="background:#E8A624;border-radius:6px;">
            <a href="${cvSignedUrl}" style="display:inline-block;padding:12px 24px;color:#ffffff;font-weight:600;text-decoration:none;font-size:14px;">📥 Télécharger le CV</a>
          </td></tr></table>
          <p style="margin:8px 0 0;font-size:11px;color:#999;">Lien valide 30 jours.</p>
          ` : ""}

          <table cellpadding="0" cellspacing="0" style="margin-top:32px;"><tr><td style="background:#1B3A5C;border-radius:6px;">
            <a href="${ADMIN_URL}" style="display:inline-block;padding:12px 24px;color:#ffffff;font-weight:600;text-decoration:none;font-size:14px;">→ Voir dans mon administration</a>
          </td></tr></table>

          <p style="margin:32px 0 0;font-size:13px;color:#999;border-top:1px solid #eee;padding-top:16px;">
            Email automatique envoyé depuis le site EQUATION.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

    const subject = `🎯 Nouvelle candidature - ${app.position || "Spontanée"} - ${app.full_name}`;

    // Tentative d'envoi via Lovable Emails (send-transactional-email).
    // Si la fonction n'est pas configurée, on log et on retourne quand même 200
    // pour ne pas bloquer le candidat — la candidature est déjà en BDD.
    try {
      const { error: sendError } = await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "new-application-notification",
          recipientEmail: ADMIN_EMAIL,
          idempotencyKey: `new-app-${applicationId}`,
          subject,
          html,
          templateData: {
            fullName: app.full_name,
            email: app.email,
            phone: app.phone,
            position: app.position,
            message: app.message,
            cvUrl: cvSignedUrl,
            cvFilename: app.cv_filename,
            dateFr,
            adminUrl: ADMIN_URL,
          },
        },
      });
      if (sendError) {
        console.warn("Lovable Email send failed (non-bloquant):", sendError);
      }
    } catch (e) {
      console.warn("Lovable Email infra non configurée (non-bloquant):", e);
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("notify-new-application error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
