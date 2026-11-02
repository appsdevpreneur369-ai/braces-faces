import Image from 'next/image';
import type { ReactNode } from 'react';
import images from '@/content/images.generated.json';
import { cn } from '@/lib/cn';
import { SHOW_DRAFT_BADGES } from '@/lib/site';

export type ImageName = keyof typeof images;

export function Photo({
  name,
  alt,
  className,
  priority,
  eager,
  sizes = '100vw',
}: {
  name: ImageName;
  alt: string;
  className?: string;
  priority?: boolean;
  /** Above the fold but not the LCP: load now without a high-priority preload competing with CSS/fonts. */
  eager?: boolean;
  sizes?: string;
}) {
  const img = images[name];
  return <Image src={img.src} width={img.width} height={img.height} alt={alt} priority={priority} loading={eager && !priority ? 'eager' : undefined} sizes={sizes} className={className} />;
}

/** Small "To confirm" chip next to facts the clinic must verify. Hidden in production builds. */
export function Verify({ show = false, dark }: { show?: boolean; dark?: boolean }) {
  if (!show || !SHOW_DRAFT_BADGES) return null;
  return (
    <span
      title="Draft: to be confirmed by the clinic before going live"
      className={cn(
        'ml-1.5 inline-flex translate-y-[-1px] items-center rounded-full border border-dashed px-2 py-0.5 align-middle font-body text-[10px] font-bold uppercase tracking-wider',
        dark ? 'border-blush/60 text-blush' : 'border-rose/50 text-rose',
      )}
    >
      To confirm
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = 'left',
  dark,
  accent = 'rose',
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: 'left' | 'center';
  dark?: boolean;
  accent?: 'rose' | 'teal';
}) {
  return (
    <div data-reveal className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center')}>
      <p className={cn('eyebrow', dark ? 'text-blush' : accent === 'teal' ? 'text-teal' : 'text-rose')}>
        <span aria-hidden className={cn('h-px w-6', dark ? 'bg-blush' : accent === 'teal' ? 'bg-teal' : 'bg-rose')} />
        {eyebrow}
      </p>
      <h2 className={cn('mt-3 text-3xl font-semibold leading-[1.15] sm:text-[2.6rem]', dark && 'text-white')}>{title}</h2>
      {intro ? <p className={cn('mt-4 text-[17px] leading-relaxed', dark ? 'text-white/75' : 'text-muted')}>{intro}</p> : null}
    </div>
  );
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.23 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29Z" />
    </svg>
  );
}

/** Line motif from the logo: a tooth outline meeting a face profile. Decorative only. */
export function Motif({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden className={className}>
      <circle cx="100" cy="100" r="92" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 6" />
      <path
        d="M62 64c10-12 26-10 38-4 12-6 28-8 38 4 9 11 6 30 0 46-5 14-7 30-14 40-5 7-11 3-12-6-2-12-4-22-12-22s-10 10-12 22c-1 9-7 13-12 6-7-10-9-26-14-40-6-16-9-35 0-46Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M78 84h44" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="84" y="80" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <rect x="108" y="80" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
