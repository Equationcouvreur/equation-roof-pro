import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON = Deno.env.get("SUPABASE_ANON_KEY")!;

    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      return new Response(JSON.stringify({ error: "Non authentifié" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userClient = createClient(SUPABASE_URL, ANON, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser(token);
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Session invalide" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const callerId = userData.user.id;

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

    const { data: roles } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", callerId);
    const isAdmin = (roles ?? []).some((r) => r.role === "admin");
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Action réservée aux admins" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const { user_id, client_user_id, redirect_to } = body as {
      user_id?: string;
      client_user_id?: string;
      redirect_to?: string;
    };
    if (!redirect_to) {
      return new Response(JSON.stringify({ error: "redirect_to requis" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let targetAuthId: string | null = null;
    let targetEmail: string | null = null;

    if (user_id) {
      targetAuthId = user_id;
      const { data: u, error: gErr } = await admin.auth.admin.getUserById(user_id);
      if (gErr || !u.user?.email) {
        return new Response(JSON.stringify({ error: "Utilisateur introuvable" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      targetEmail = u.user.email;
    } else if (client_user_id) {
      const { data: cu } = await admin
        .from("client_users")
        .select("auth_user_id, email")
        .eq("id", client_user_id)
        .maybeSingle();
      if (!cu) {
        return new Response(JSON.stringify({ error: "Client introuvable" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      targetAuthId = cu.auth_user_id;
      targetEmail = cu.email;
    } else {
      return new Response(JSON.stringify({ error: "user_id ou client_user_id requis" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!targetEmail) {
      return new Response(JSON.stringify({ error: "Email introuvable pour ce compte" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use anon client to trigger the standard reset flow (sends email through Supabase Auth)
    const anonClient = createClient(SUPABASE_URL, ANON);
    const { error: resetErr } = await anonClient.auth.resetPasswordForEmail(targetEmail, {
      redirectTo: redirect_to,
    });
    if (resetErr) {
      return new Response(JSON.stringify({ error: resetErr.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    await admin.from("audit_log").insert({
      admin_user_id: callerId,
      action: "password_reset_email_sent",
      target_user_id: targetAuthId,
      metadata: { email: targetEmail, ...(client_user_id ? { client_user_id } : {}) },
    });

    return new Response(JSON.stringify({ ok: true, email: targetEmail }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
