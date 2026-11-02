import { clinic } from '@/content/clinic';
import { cn } from '@/lib/cn';

/** Google's "G" mark — a third-party brand asset, drawn in Google's own colours (the one exception to the palette). */
export function GoogleG({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" focusable="false">
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z" />
    </svg>
  );
}

/** Five stars filled to the rating, in Google's review-star yellow. Decorative: always pair with a text rating. */
export function Stars({ rating, className = 'h-4 w-4' }: { rating: number; className?: string }) {
  return (
    <span className="inline-flex gap-0.5" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => {
        const pct = Math.round(Math.max(0, Math.min(1, rating - i)) * 100);
        const id = `star-${i}-${pct}`;
        return (
          <svg key={i} viewBox="0 0 20 20" className={className}>
            <defs>
              <linearGradient id={id}>
                <stop offset={`${pct}%`} stopColor="#FBBC04" />
                <stop offset={`${pct}%`} stopColor="#D9D6E3" />
              </linearGradient>
            </defs>
            <path fill={`url(#${id})`} d="M10 1.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6L10 15l-5.4 3 1.2-6L1.3 7.8l6.1-.7z" />
          </svg>
        );
      })}
    </span>
  );
}

/** Hero badge: G + rating + stars + review count. Jumps to the reviews band on the home page. */
export function GoogleBadge({ className, href = '/#reviews' }: { className?: string; href?: string }) {
  const rating = Number(clinic.google.rating);
  return (
    <a
      href={href}
      className={cn('group inline-flex min-h-[56px] items-center gap-3 rounded-2xl bg-white px-4 py-2.5 text-ink shadow-lift transition hover:-translate-y-0.5', className)}
    >
      <GoogleG className="h-8 w-8 shrink-0" />
      <span className="leading-tight">
        <span className="flex items-center gap-2">
          <span className="font-heading text-xl font-bold">{clinic.google.rating}</span>
          <Stars rating={rating} className="h-4 w-4" />
          <span className="sr-only">out of 5 on Google</span>
        </span>
        <span className="block text-xs font-semibold text-muted group-hover:text-ink">
          {clinic.google.reviewCount} Google reviews · read them <span aria-hidden>→</span>
        </span>
      </span>
    </a>
  );
}
