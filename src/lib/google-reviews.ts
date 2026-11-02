// Google reviews, live from the Google Places API (New). Server-only: the key never reaches the browser.
//   GOOGLE_PLACES_API_KEY  server env on Cloud Run (never NEXT_PUBLIC_*). Without it the site shows the rating/count
//                          from src/content/clinic.ts and a "Read them on Google" link — no review text.
//   GOOGLE_PLACE_ID        optional; else clinic.google.placeId; else ONE text search for the clinic (cached a week)
//                          that only accepts a result whose name contains "Braces" in Tadepalli/Vijayawada.
// Served by /api/reviews (fetched when the visitor opens the reviews), so every page stays static. Results are cached
// a day with unstable_cache; a failure is never cached (the next request tries again). Review text is never stored in
// the repo (Google Maps Platform terms). Shown with the author name + relative time exactly as Google gives them.
import 'server-only';
import { unstable_cache } from 'next/cache';
import { clinic } from '@/content/clinic';

export type GoogleReview = { author: string; authorUrl?: string; photo?: string; rating: number; text: string; when: string };
export type GoogleReviews = { rating: number; count: number; url: string; writeUrl?: string; reviews: GoogleReview[]; live: boolean };

type Place = {
  id?: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: {
    rating?: number;
    relativePublishTimeDescription?: string;
    text?: { text?: string };
    originalText?: { text?: string };
    authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
  }[];
};

export const fallbackReviews = (): GoogleReviews => ({
  rating: Number(clinic.google.rating),
  count: clinic.google.reviewCount,
  url: clinic.mapsUrl,
  reviews: [],
  live: false,
});

const key = () => process.env.GOOGLE_PLACES_API_KEY ?? '';

async function places<T>(path: string, init: RequestInit & { fieldMask: string }): Promise<T> {
  const res = await fetch(`https://places.googleapis.com/v1/${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': key(), 'X-Goog-FieldMask': init.fieldMask, ...(init.headers ?? {}) },
    cache: 'no-store',
    signal: AbortSignal.timeout(6000),
  });
  if (!res.ok) throw new Error(`Places API HTTP ${res.status} ${(await res.text()).slice(0, 200)}`);
  return (await res.json()) as T;
}

/** Finds the clinic's Place ID once (no ID configured yet). Throws unless the match is clearly this clinic. */
const findPlaceId = unstable_cache(
  async () => {
    const r = await places<{ places?: Place[] }>('places:searchText', {
      method: 'POST',
      fieldMask: 'places.id,places.displayName,places.formattedAddress',
      body: JSON.stringify({ textQuery: clinic.google.searchQuery, regionCode: 'IN', languageCode: 'en' }),
    });
    const hit = (r.places ?? []).find(
      (p) => /braces/i.test(p.displayName?.text ?? '') && /tadep|vijayawada|522501/i.test(p.formattedAddress ?? ''),
    );
    if (!hit?.id) throw new Error('clinic not found by text search');
    return hit.id;
  },
  ['bnf-google-place-id'],
  { revalidate: 7 * 86400 },
);

const fetchPlace = unstable_cache(
  async (placeId: string) => {
    const p = await places<Place>(`places/${encodeURIComponent(placeId)}?languageCode=en`, {
      method: 'GET',
      fieldMask: 'rating,userRatingCount,googleMapsUri,reviews',
    });
    return {
      rating: p.rating ?? null,
      count: p.userRatingCount ?? null,
      url: p.googleMapsUri ?? null,
      reviews: (p.reviews ?? [])
        .map((r) => ({
          author: r.authorAttribution?.displayName ?? '',
          authorUrl: r.authorAttribution?.uri,
          photo: r.authorAttribution?.photoUri,
          rating: r.rating ?? 0,
          text: (r.text?.text ?? r.originalText?.text ?? '').trim(),
          when: r.relativePublishTimeDescription ?? '',
        }))
        .filter((r) => r.author && r.rating && r.text),
    };
  },
  ['bnf-google-place'],
  { revalidate: 86400 },
);

export async function getGoogleReviews(): Promise<GoogleReviews> {
  const fb = fallbackReviews();
  if (!key()) return fb;
  try {
    const placeId = process.env.GOOGLE_PLACE_ID || clinic.google.placeId || (await findPlaceId());
    const live = await fetchPlace(placeId);
    return {
      rating: live.rating ?? fb.rating,
      count: live.count ?? fb.count,
      url: live.url ?? fb.url,
      writeUrl: `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}`,
      reviews: live.reviews,
      live: true,
    };
  } catch (e) {
    console.warn(`[google-reviews] fallback: ${e instanceof Error ? e.message : String(e)}`);
    return fb;
  }
}
