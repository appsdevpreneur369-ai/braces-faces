import Link from 'next/link';
import { Clock, MapPin, Phone } from 'lucide-react';
import { clinic, fullAddress, telHref } from '@/content/clinic';
import { doctors } from '@/content/doctors';
import { generalWhatsappHref } from '@/lib/appointment';
import { NAV } from '@/content/nav';
import { Logo } from './Logo';
import { Verify, WhatsAppIcon } from './ui';

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink-deep pb-28 pt-16 text-white/75 lg:pb-10">
      <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-blush/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-mint/10 blur-3xl" />
      <div className="container-site relative grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Logo dark />
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed">
            A {clinic.centre.toLowerCase()} in Tadepalli — orthodontics and oral &amp; maxillofacial surgery, under one roof.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={telHref} className="btn-blush min-h-[44px] px-5 text-sm">
              <Phone className="h-4 w-4" aria-hidden /> Call
            </a>
            <a href={generalWhatsappHref} target="_blank" rel="noopener noreferrer" className="btn-ghost-dark min-h-[44px] px-5 text-sm">
              <WhatsAppIcon className="h-4 w-4" /> WhatsApp
            </a>
          </div>
        </div>

        <div>
          <h2 className="font-body text-sm font-bold uppercase tracking-[0.16em] text-white">Explore</h2>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="hover:text-white">{n.label}</Link>
              </li>
            ))}
            <li><Link href="/book" className="hover:text-white">Book appointment</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="font-body text-sm font-bold uppercase tracking-[0.16em] text-white">Consultants</h2>
          <ul className="mt-4 space-y-3 text-[15px]">
            {doctors.map((d) => (
              <li key={d.slug}>
                <Link href={`/doctors/${d.slug}`} className="hover:text-white">
                  <span className="block text-white">{d.name}</span>
                  <span className="text-sm text-white/60">{d.specialityLabel}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-body text-sm font-bold uppercase tracking-[0.16em] text-white">Visit us</h2>
          <ul className="mt-4 space-y-4 text-[15px]">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-blush" aria-hidden />
              <a href={clinic.mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                {fullAddress}
                <Verify show={clinic.address.verify} dark />
              </a>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-blush" aria-hidden />
              <a href={telHref} className="hover:text-white">{clinic.phone.display}</a>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-blush" aria-hidden />
              <span>
                {clinic.hours.label}
                <Verify show={clinic.hours.verifyDays} dark />
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="container-site relative mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} {clinic.name}. Information on this site is general and not a substitute for a consultation.</p>
        <p className="flex gap-5">
          <Link href="/privacy" className="hover:text-white">Privacy</Link>
          <span>Website by ClinicFlow247</span>
        </p>
      </div>
    </footer>
  );
}
