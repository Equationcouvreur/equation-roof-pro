import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type GoogleReview = {
  author: string;
  photo: string | null;
  rating: number;
  text: string;
  relativeTime: string;
};

export type GoogleData = {
  rating: number | null;
  userRatingCount: number;
  googleMapsUri: string | null;
  reviews: GoogleReview[];
};

const PLACE_URL = "https://share.google/gzbbMMOG3ENd5qnbt";
const REVIEW_URL = "https://share.google/gzbbMMOG3ENd5qnbt";

let cache: { data: GoogleData; at: number } | null = null;

export function useGoogleReviews() {
  const [data, setData] = useState<GoogleData | null>(cache?.data ?? null);

  useEffect(() => {
    if (cache && Date.now() - cache.at < 10 * 60_000) return;
    supabase.functions.invoke("google-reviews").then(({ data: d, error }) => {
      if (!error && d) {
        cache = { data: d as GoogleData, at: Date.now() };
        setData(d as GoogleData);
      }
    });
  }, []);

  const googleUrl = PLACE_URL;
  const reviewUrl = REVIEW_URL;
  return { data, googleUrl, reviewUrl };
}
