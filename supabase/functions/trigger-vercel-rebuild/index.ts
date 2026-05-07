import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const hookUrl = Deno.env.get("VERCEL_DEPLOY_HOOK_URL");
  if (!hookUrl) {
    return new Response(
      JSON.stringify({ error: "VERCEL_DEPLOY_HOOK_URL not configured" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const response = await fetch(hookUrl, { method: "POST" });
    const result = await response.json();
    console.log('[vercel-rebuild] Triggered:', result);
    return new Response(
      JSON.stringify({ triggered: true, vercel: result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[vercel-rebuild] Error:', error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
