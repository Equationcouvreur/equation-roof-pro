import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const PLACE_ID = 'ChIJz8r4IDEd90cR1ycormghd-s';
const GATEWAY_URL = 'https://connector-gateway.lovable.dev/google_maps';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  const GOOGLE_MAPS_API_KEY = Deno.env.get('GOOGLE_MAPS_API_KEY');
  if (!LOVABLE_API_KEY || !GOOGLE_MAPS_API_KEY) {
    return new Response(JSON.stringify({ error: 'Missing connector credentials' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const res = await fetch(`${GATEWAY_URL}/places/v1/places/${PLACE_ID}?languageCode=fr`, {
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'X-Connection-Api-Key': GOOGLE_MAPS_API_KEY,
        'X-Goog-FieldMask': 'id,displayName,rating,userRatingCount,googleMapsUri,reviews',
      },
    });
    const data = await res.json();
    if (!res.ok) {
      return new Response(JSON.stringify({ error: 'Google API error', details: data }), {
        status: res.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({
      rating: data.rating ?? null,
      userRatingCount: data.userRatingCount ?? 0,
      googleMapsUri: data.googleMapsUri ?? null,
      reviews: (data.reviews ?? []).map((r: any) => ({
        author: r.authorAttribution?.displayName ?? 'Anonyme',
        photo: r.authorAttribution?.photoUri ?? null,
        rating: r.rating,
        text: r.text?.text ?? r.originalText?.text ?? '',
        relativeTime: r.relativePublishTimeDescription ?? '',
        publishTime: r.publishTime ?? null,
      })),
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
