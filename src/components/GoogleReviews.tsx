'use client';

import { useId, useState } from 'react';
import { ChevronDown, ExternalLink, PenLine } from 'lucide-react';
import { clinic } from '@/content/clinic';
import type { GoogleReviews as Data } from '@/lib/google-reviews';
import { cn } from '@/lib/cn';
import { GoogleG, Stars } from './google';
import { Verify } from './ui';

type Review = Data['reviews'][number];

/**
 * Google reviews band. Collapsed by default (rating + count); "Read patient reviews" expands it and fetches the latest
 * reviews from /api/reviews (live Places API, server-side, cached a day). Text is verbatim with Google's attribution.
 * Without a Places API key the panel offers the Google listing instead — review text is never copied into the site.
 */
export function GoogleReviews() {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<Data | null>(null);
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  const toggle = async () => {
    const next = !open;
    setOpen(next);
    if (!next || state !== 'idle') return;
    setState('loading');
    try {
      const res = await fetch('/api/reviews');
      if (!res.ok) throw new Error(String(res.status));
      setData((await res.json()) as Data);
      setState('done');
    } catch {
      setState('error');
    }
  };

  const rating = data?.rating ?? Number(clinic.google.rating);
  const count = data?.count ?? clinic.google.reviewCount;
  const url = data?.url ?? clinic.mapsUrl;
  const reviews = data?.reviews ?? [];

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="bg-white py-16 sm:py-20">
      <div className="container-site">
        <div data-reveal className="relative overflow-hidden rounded-[2rem] border border-line bg-gradient-to-br from-lavender-soft via-white to-blush-soft shadow-soft">
          <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[auto_1fr_auto] lg:items-center">
            <div className="flex items-center gap-5">
              <span className="grid h-20 w-20 shrink-0 place-items-center rounded-3xl bg-white shadow-lift ring-1 ring-line">
                <GoogleG className="h-11 w-11" />
              </span>
              <div>
                <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-heading text-6xl font-bold leading-none text-ink">{rating.toFixed(1)}</span>
                  <Stars rating={rating} className="h-6 w-6" />
                </p>
                <p className="mt-2 text-sm font-semibold text-muted">
                  {count} reviews on Google
                  <span className="sr-only">, rated {rating.toFixed(1)} out of 5</span>
                  <Verify show={clinic.google.verify && !data?.live} />
                </p>
              </div>
            </div>
            <div>
              <p className="eyebrow text-rose">
                <span aria-hidden className="h-px w-6 bg-rose" /> Patient reviews
              </p>
              <h2 id="reviews-title" className="mt-2 text-3xl font-semibold leading-tight sm:text-[2.2rem]">
                What our patients say on Google.
              </h2>
              <p className="mt-2 text-muted">Real, unedited reviews. Open them here, or read them all on Google.</p>
            </div>
            <div className="flex flex-wrap gap-3 lg:flex-col">
              <button type="button" onClick={toggle} aria-expanded={open} aria-controls={panelId} className="btn-ink">
                {open ? 'Hide reviews' : 'Read patient reviews'}
                <ChevronDown className={cn('h-4 w-4 transition-transform duration-300', open && 'rotate-180')} aria-hidden />
              </button>
              <a href={url} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                All reviews on Google <ExternalLink className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </div>

          <div id={panelId} hidden={!open} className="border-t border-line bg-white/70 p-6 sm:p-10">
            {state === 'loading' && (
              <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" aria-label="Loading reviews" aria-busy="true">
                {[0, 1, 2].map((i) => (
                  <li key={i} className="h-44 animate-pulse rounded-card bg-lavender-soft" />
                ))}
              </ul>
            )}
            {state === 'done' && reviews.length > 0 && (
              <>
                <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {reviews.map((r) => (
                    <ReviewCard key={r.author + r.when} r={r} />
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
                  <p className="flex items-center gap-2">
                    <GoogleG className="h-4 w-4" /> Latest reviews from Google · showing {reviews.length} of {count}
                  </p>
                  {data?.writeUrl && (
                    <a href={data.writeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center gap-2 font-semibold text-ink hover:underline">
                      <PenLine className="h-4 w-4" aria-hidden /> Write a review
                    </a>
                  )}
                </div>
              </>
            )}
            {(state === 'error' || (state === 'done' && reviews.length === 0)) && (
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-xl text-muted">Read every review, in the patients’ own words, on our Google listing.</p>
                <a href={url} target="_blank" rel="noopener noreferrer" className="btn-ink">
                  <GoogleG className="h-5 w-5 rounded-full bg-white p-0.5" /> Open Google reviews
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ r }: { r: Review }) {
  const [more, setMore] = useState(false);
  const long = r.text.length > 220;
  return (
    <li className="flex flex-col rounded-card border border-line bg-white p-5 shadow-soft">
      <div className="flex items-center gap-3">
        {r.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={r.photo} alt="" width={40} height={40} loading="lazy" referrerPolicy="no-referrer" className="h-10 w-10 rounded-full object-cover" />
        ) : (
          <span aria-hidden className="grid h-10 w-10 place-items-center rounded-full bg-lavender-soft font-heading font-bold text-ink">
            {r.author.charAt(0)}
          </span>
        )}
        <div className="min-w-0 flex-1">
          {r.authorUrl ? (
            <a href={r.authorUrl} target="_blank" rel="noopener noreferrer" className="block truncate font-semibold text-ink hover:underline">
              {r.author}
            </a>
          ) : (
            <p className="truncate font-semibold text-ink">{r.author}</p>
          )}
          <p className="text-xs text-muted">{r.when}</p>
        </div>
        <GoogleG className="h-5 w-5 shrink-0" />
      </div>
      <p className="mt-3">
        <Stars rating={r.rating} />
        <span className="sr-only">{r.rating} out of 5</span>
      </p>
      <blockquote className="mt-2 flex-1 text-[15px] leading-relaxed text-body">
        <p className={cn(!more && long && 'line-clamp-5')}>{r.text}</p>
      </blockquote>
      {long && (
        <button type="button" onClick={() => setMore((m) => !m)} aria-expanded={more} className="mt-2 min-h-[44px] self-start text-sm font-semibold text-rose hover:underline">
          {more ? 'Show less' : 'Read more'}
        </button>
      )}
    </li>
  );
}
