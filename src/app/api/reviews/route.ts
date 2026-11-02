import { NextResponse } from 'next/server';
import { getGoogleReviews } from '@/lib/google-reviews';

// Called by the browser when a visitor opens the Google reviews. Runs per request (Cloud Run gives CPU only while a
// request is open); the Places result itself is cached a day in src/lib/google-reviews.ts.
export const dynamic = 'force-dynamic';

export async function GET() {
  const data = await getGoogleReviews();
  return NextResponse.json(data, { headers: { 'Cache-Control': data.live ? 'public, max-age=3600, s-maxage=3600' : 'no-store' } });
}
