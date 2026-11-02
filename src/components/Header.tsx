'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { CalendarCheck, Clock, MapPin, Menu, Phone, X } from 'lucide-react';
import { clinic, telHref } from '@/content/clinic';
import { NAV } from '@/content/nav';
import { generalWhatsappHref } from '@/lib/appointment';
import { cn } from '@/lib/cn';
import { OpenStatus } from './client';
import { Logo } from './Logo';
import { WhatsAppIcon } from './ui';

/**
 * Working-hours bar (scrolls away) + a white sticky header with a FIXED 72px height. Scrolling only toggles the shadow,
 * never the height (a height change at the threshold makes the header bounce). Nav items are plain text: no box, pill or
 * rounded focus outline — only an underline on the current page (and on hover / keyboard focus).
 */
export function Header() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menuTop, setMenuTop] = useState(72);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    // The hours bar above the header may still be on screen: start the sheet exactly under the header.
    setMenuTop(Math.round(headerRef.current?.getBoundingClientRect().bottom ?? 72));
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const isActive = (href: string) => !href.includes('#') && (pathname === href || pathname.startsWith(`${href}/`));

  return (
    <>
      {/* Working hours first, on every screen size (owner, 2 Nov 2026). */}
      <div className="bg-ink-deep text-[13px] text-white/75">
        <div className="container-site flex h-9 items-center justify-between gap-4 sm:h-10">
          <div className="flex min-w-0 items-center gap-4">
            <p className="flex shrink-0 items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-blush" aria-hidden />
              <span className="sr-only sm:not-sr-only">Working hours:</span>
              <span className="font-semibold text-white">{clinic.hours.label}</span>
            </p>
            <span aria-hidden className="h-3.5 w-px bg-white/20" />
            <OpenStatus />
            <p className="hidden min-w-0 items-center gap-1.5 lg:flex">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-blush" aria-hidden />
              <span className="truncate">
                {clinic.address.line2}, {clinic.address.locality}, {clinic.address.city}
              </span>
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-5">
            <a href={telHref} className="hidden items-center gap-1.5 font-semibold text-white hover:text-blush md:inline-flex">
              <Phone className="h-3.5 w-3.5 text-blush" aria-hidden /> {clinic.phone.display}
            </a>
            <a href={generalWhatsappHref} target="_blank" rel="noopener noreferrer" className="hidden items-center gap-1.5 font-semibold text-white hover:text-blush md:inline-flex">
              <WhatsAppIcon className="h-3.5 w-3.5 text-wa" /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      <header
        ref={headerRef}
        className={cn(
          'sticky top-0 z-50 h-[72px] border-b bg-white/95 backdrop-blur-xl transition-[box-shadow,border-color] duration-300',
          scrolled || open ? 'border-line shadow-soft' : 'border-transparent',
        )}
      >
        <div className="container-site flex h-full items-center justify-between gap-4">
          <Logo />
          <nav aria-label="Main" className="hidden h-full lg:block">
            <ul className="flex h-full items-center gap-1">
              {NAV.map((item) => (
                <li key={item.href} className="h-full">
                  <Link href={item.href} aria-current={isActive(item.href) ? 'page' : undefined} className="nav-link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            <a href={telHref} aria-label={`Call ${clinic.phone.display}`} className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink hover:bg-ink/5 sm:hidden">
              <Phone className="h-5 w-5 text-rose" aria-hidden />
            </a>
            <Link href="/book" className="btn-ink hidden min-h-[44px] px-5 sm:inline-flex">
              <CalendarCheck className="h-4 w-4" aria-hidden /> Book appointment
            </Link>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink hover:bg-ink/5 lg:hidden"
            >
              {open ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
            </button>
          </div>
        </div>

        <div id="mobile-menu" hidden={!open} style={{ top: menuTop }} className="fixed inset-x-0 bottom-0 overflow-y-auto bg-white px-5 pb-28 pt-2 lg:hidden">
          <nav aria-label="Mobile" className="flex flex-col">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className="mobile-nav-link"
              >
                {item.label}
                <span aria-hidden className="text-rose">→</span>
              </Link>
            ))}
          </nav>
          <div className="mt-8 grid gap-3">
            <Link href="/book" onClick={() => setOpen(false)} className="btn-ink w-full">
              <CalendarCheck className="h-4 w-4" aria-hidden /> Book appointment
            </Link>
            <a href={telHref} className="btn-ghost w-full">
              <Phone className="h-4 w-4" aria-hidden /> Call {clinic.phone.display}
            </a>
          </div>
          <p className="mt-6 flex items-center gap-2 text-sm text-muted">
            <Clock className="h-4 w-4 text-rose" aria-hidden /> Working hours: {clinic.hours.label}
          </p>
        </div>
      </header>
    </>
  );
}
