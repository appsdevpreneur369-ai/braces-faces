'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { clinic } from '@/content/clinic';
import { isOpen } from '@/lib/hours';
import { cn } from '@/lib/cn';

/** Adds .is-visible to [data-reveal] elements as they scroll in. Re-runs on client navigation. */
export function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    document.documentElement.classList.add('reveal-ready');
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-visible)'));
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);
  return null;
}

/** "Open now · till 8 PM" / "Closed · opens 10 AM" in clinic time. Renders nothing until mounted (no hydration mismatch). */
export function OpenNow({ dark, className }: { dark?: boolean; className?: string }) {
  const [open, setOpen] = useState<boolean | null>(null);
  useEffect(() => {
    const tick = () => setOpen(isOpen());
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);
  if (open === null) return <span className={cn('inline-flex h-7 w-36 rounded-full align-middle', dark ? 'bg-white/5' : 'bg-white/60', className)} aria-hidden />;
  return (
    <span
      className={cn(
        'inline-flex h-7 items-center gap-2 rounded-full px-3 align-middle text-xs font-semibold',
        dark ? 'bg-white/10 text-white' : 'bg-white text-ink ring-1 ring-line',
        className,
      )}
    >
      <span className={cn('relative flex h-2 w-2')}>
        {open ? <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-wa opacity-60" /> : null}
        <span className={cn('relative inline-flex h-2 w-2 rounded-full', open ? 'bg-wa' : 'bg-blush')} />
      </span>
      {open ? `Open now · till ${clinic.hours.label.split('–')[1].trim()}` : `Closed now · opens ${clinic.hours.label.split('–')[0].trim()}`}
    </span>
  );
}

/** Text-only open/closed line for the dark working-hours bar. Fixed-width placeholder until mounted (no layout shift). */
export function OpenStatus({ className }: { className?: string }) {
  const [open, setOpen] = useState<boolean | null>(null);
  useEffect(() => {
    const tick = () => setOpen(isOpen());
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);
  const [from, till] = clinic.hours.label.split('–').map((s) => s.trim());
  return (
    <span className={cn('inline-flex min-w-[7.5rem] items-center gap-2 whitespace-nowrap font-semibold text-white', className)} aria-live="polite">
      <span aria-hidden className={cn('h-2 w-2 rounded-full', open === null ? 'bg-white/30' : open ? 'bg-wa' : 'bg-blush')} />
      {open === null ? <span className="text-white/50">Clinic hours</span> : open ? `Open now · till ${till}` : `Closed · opens ${from}`}
    </span>
  );
}
