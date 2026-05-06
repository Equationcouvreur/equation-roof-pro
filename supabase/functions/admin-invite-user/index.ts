import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const ALLOWED_ROLES = [
  "admin",
  "editor",
  "blog_editor",
  "realisations_editor",
  "sections_editor",
  "recrutement_editor",
  "commercial",
];

interface InvitePayload {
  email: string;
  full_name: string;
  role: string;
}

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON_KEY =
      Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!;

    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader.startsWith("Bearer ")) return json(401, { error: "Non authentifié" });

    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) return json(401, { error: "Session invalide" });

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

    // Seuls les admins peuvent inviter
    const { data: isAdmin } = await admin.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "admin",
    });
    if (!isAdmin) return json(403, { error: "Réservé aux administrateurs" });

    const body = (await req.json()) as InvitePayload;
    const email = body.email?.trim().toLowerCase();
    const full_name = body.full_name?.trim();
    const role = body.role?.trim();

    if (!email || !full_name || !role) return json(400, { error: "Champs requis manquants" });
    if (!ALLOWED_ROLES.includes(role)) return json(400, { error: "Rôle invalide" });

    // Invite par email — utilise les templates Supabase par défaut
    const { data: invited, error: invErr } = await admin.auth.admin.inviteUserByEmail(email, {
      data: { full_name },
    });
    if (invErr || !invited.user) return json(400, { error: invErr?.message ?? "Invitation échouée" });

    // Override du nom dans profiles si la ligne a déjà été créée par le trigger
    await admin
      .from("profiles")
      .update({ full_name })
      .eq("id", invited.user.id);

    // Insère le rôle
    const { error: roleErr } = await admin
      .from("user_roles")
      .insert({ user_id: invited.user.id, role });
    if (roleErr) return json(400, { error: roleErr.message });

    return json(200, { user_id: invited.user.id, email, role });
  } catch (e) {
    return json(500, { error: (e as Error).message });
  }
});
