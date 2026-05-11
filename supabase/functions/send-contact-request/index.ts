const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ADMIN_EMAIL = "info@etanche.com";
const FROM = "EQUATION Site <contact@send.digitori.fr>";

function escapeHtml(s: string): string {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY missing");

    const body = await req.json();
    const { nom, prenom, email, telephone, type, surface, message } = body || {};

    if (!nom || !prenom || !email || !telephone) {
      return new Response(JSON.stringify({ error: "Champs requis manquants" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: "Email invalide" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const dateFr = new Date().toLocaleDateString("fr-FR", {
      day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
    });

    const html = `<!DOCTYPE html><html lang="fr"><body style="margin:0;padding:0;background:#f5f3ee;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:#1B3A5C;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f3ee;padding:32px 16px;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;max-width:600px;">
<tr><td style="background:#1B3A5C;padding:24px;text-align:center;">
<h1 style="margin:0;color:#E8A624;font-size:22px;">EQUATION</h1>
<p style="margin:6px 0 0;color:#fff;font-size:13px;opacity:0.9;">Nouvelle demande de devis</p></td></tr>
<tr><td style="padding:32px 28px;">
<p style="margin:0 0 20px;font-size:15px;">Bonjour Thierry,</p>
<p style="margin:0 0 24px;font-size:15px;">Une nouvelle demande de devis vient d'être déposée sur le site.</p>
<h2 style="margin:24px 0 12px;font-size:16px;color:#1B3A5C;border-bottom:2px solid #E8A624;padding-bottom:6px;">Coordonnées</h2>
<table cellpadding="6" cellspacing="0" style="width:100%;font-size:14px;">
<tr><td style="color:#666;width:160px;">Nom</td><td style="font-weight:600;">${escapeHtml(prenom)} ${escapeHtml(nom)}</td></tr>
<tr><td style="color:#666;">Email</td><td><a href="mailto:${escapeHtml(email)}" style="color:#2C8C6F;">${escapeHtml(email)}</a></td></tr>
<tr><td style="color:#666;">Téléphone</td><td><a href="tel:${escapeHtml(telephone)}" style="color:#2C8C6F;">${escapeHtml(telephone)}</a></td></tr>
<tr><td style="color:#666;">Type de projet</td><td>${escapeHtml(type || "Non précisé")}</td></tr>
<tr><td style="color:#666;">Surface</td><td>${escapeHtml(surface || "Non précisée")}</td></tr>
<tr><td style="color:#666;">Date</td><td>${dateFr}</td></tr></table>
${message ? `<h2 style="margin:28px 0 12px;font-size:16px;color:#1B3A5C;border-bottom:2px solid #E8A624;padding-bottom:6px;">Message</h2>
<div style="background:#f5f3ee;padding:16px;border-radius:8px;font-size:14px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(message)}</div>` : ""}
<p style="margin:32px 0 0;font-size:13px;color:#999;border-top:1px solid #eee;padding-top:16px;">Email automatique du site EQUATION.</p>
</td></tr></table></td></tr></table></body></html>`;

    const subject = `📩 Devis - ${type || "Demande"} - ${prenom} ${nom}`;

    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM,
        to: [ADMIN_EMAIL],
        reply_to: email,
        subject,
        html,
      }),
    });

    const result = await resp.json();
    if (!resp.ok) {
      console.error("Resend error:", result);
      return new Response(JSON.stringify({ error: result }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Accusé de réception au demandeur (best-effort)
    try {
      const confirmHtml = `<!DOCTYPE html><html lang="fr"><body style="margin:0;padding:0;background:#f5f3ee;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:#1B3A5C;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f3ee;padding:32px 16px;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:600px;">
<tr><td style="background:#1B3A5C;padding:24px;text-align:center;">
<h1 style="margin:0;color:#E8A624;font-size:22px;">EQUATION</h1>
<p style="margin:6px 0 0;color:#fff;font-size:13px;opacity:0.9;">Demande de devis bien reçue</p></td></tr>
<tr><td style="padding:32px 28px;font-size:15px;line-height:1.6;">
<p style="margin:0 0 16px;">Bonjour ${escapeHtml(prenom)},</p>
<p style="margin:0 0 16px;">Nous avons bien reçu votre demande de devis${type ? ` pour <strong>${escapeHtml(type)}</strong>` : ""} et vous remercions pour votre confiance.</p>
<p style="margin:0 0 16px;">Notre équipe va l'étudier et reviendra vers vous sous <strong>48h ouvrées</strong> pour échanger sur votre projet.</p>
<p style="margin:0 0 16px;">En cas d'urgence, vous pouvez nous joindre directement au <strong>04 73 87 53 50</strong>.</p>
<p style="margin:24px 0 0;">À très bientôt,<br/>L'équipe EQUATION</p>
<p style="margin:32px 0 0;font-size:13px;color:#999;border-top:1px solid #eee;padding-top:16px;">EQUATION — Étanchéité & Couverture<br/>04 73 87 53 50 — info@etanche.com</p>
</td></tr></table></td></tr></table></body></html>`;

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: FROM,
          to: [email],
          reply_to: ADMIN_EMAIL,
          subject: "Votre demande de devis a bien été reçue — EQUATION",
          html: confirmHtml,
        }),
      });
    } catch (e) {
      console.warn("Confirmation demandeur échouée:", e);
    }

    return new Response(JSON.stringify({ ok: true, id: result.id }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-contact-request error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
