import Link from 'next/link';
import { BadgeCheck, CalendarCheck, Clock, MapPin, Navigation, Phone, Stethoscope } from 'lucide-react';
import { clinic, telHref } from '@/content/clinic';
import { type Doctor, doctors } from '@/content/doctors';
import { generalWhatsappHref } from '@/lib/appointment';
import { cn } from '@/lib/cn';
import { BookTrigger } from '../assistant/AssistantProvider';
import { GoogleBadge } from '../google';
import { Motif, Photo, WhatsAppIcon } from '../ui';

const [ortho, maxfax] = doctors;
// The rotating word in the headline. Last word repeats the first so the loop restarts without a jump.
const WORDS = ['smile.', 'bite.', 'jaw.', 'face.'];

/**
 * Home hero (v2, 2 Nov 2026 owner brief "make it awesome"): the clinic's own waiting room, softened under a navy veil
 * with slow blush/mint light; headline with a rotating word; Google badge; the two specialists in arches with what
 * each treats; quick actions overlapping the bottom edge. Motion is CSS only and off for reduced motion.
 * The photos are small (680px) — hence blurred texture behind, never a sharp full-bleed photo.
 */
export function Hero() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink-deep text-white">
        {/* Background: real clinic, softened + moving light */}
        <div aria-hidden className="absolute inset-0 -z-30">
          <Photo name="clinic-waiting-room" alt="" sizes="100vw" eager className="h-full w-full scale-110 object-cover opacity-[0.22] blur-[3px] saturate-50" />
        </div>
        <div aria-hidden className="absolute inset-0 -z-20 bg-[radial-gradient(120%_90%_at_10%_10%,rgba(19,22,58,.55),#13163A_70%)]" />
        <div aria-hidden className="absolute -left-40 -top-24 -z-10 h-[36rem] w-[36rem] animate-drift rounded-full bg-blush/25 blur-[110px] motion-reduce:animate-none" />
        <div aria-hidden className="absolute -right-32 top-1/3 -z-10 h-[34rem] w-[34rem] animate-drift-r rounded-full bg-mint/20 blur-[110px] motion-reduce:animate-none" />
        <div aria-hidden className="absolute bottom-0 left-1/3 -z-10 h-72 w-72 rounded-full bg-lavender/25 blur-[100px]" />
        <div aria-hidden className="absolute inset-0 -z-10 opacity-[0.06] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_30%_40%,black_20%,transparent_70%)]" />

        <div className="container-site grid items-center gap-12 pb-36 pt-8 sm:gap-14 sm:pb-32 sm:pt-14 lg:min-h-[680px] lg:grid-cols-[1.08fr_1fr] lg:gap-8 lg:pb-36 lg:pt-16">
          <div className="animate-fade-up">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-xs font-semibold text-white/85 backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blush opacity-70 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blush" />
              </span>
              Maxillofacial &amp; Orthodontic Centre · Tadepalli
            </p>

            <div className="mt-5 flex items-center gap-3 lg:hidden">
              <span className="flex -space-x-3">
                {[ortho, maxfax].map((d, i) => (
                  <Photo key={d.slug} name={d.image} alt="" sizes="48px" eager className={cn('h-12 w-12 rounded-full object-cover object-top ring-2 ring-ink-deep', i === 0 ? 'bg-blush' : 'bg-mint')} />
                ))}
              </span>
              <span className="text-sm leading-tight text-white/80">
                <span className="block font-semibold text-white">Dr. Bharghav &amp; Dr. Sai Meghana</span>
                Orthodontist · Maxillofacial surgeon
              </span>
            </div>

            <h1 className="mt-5 font-heading lg:mt-6 text-[2.5rem] font-bold leading-[1.08] tracking-[-0.035em] text-white sm:text-[3.6rem] lg:text-[4.1rem]">
              <span className="sr-only">Specialist care for your smile, bite, jaw and face.</span>
              <span aria-hidden>
                Specialist care
                <br />
                for your{' '}
                <span className="relative inline-block h-[1.12em] overflow-hidden align-bottom">
                  <span className="flex animate-words flex-col motion-reduce:animate-none">
                    {WORDS.map((w) => (
                      <span key={w} className="h-[1.12em] bg-gradient-to-r from-blush via-[#F7D6E0] to-mint bg-clip-text text-transparent">
                        {w}
                      </span>
                    ))}
                  </span>
                </span>
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">
              An orthodontist and an oral &amp; maxillofacial surgeon, side by side — so braces, aligners, jaw surgery, TMJ care and facial injuries are planned by the right specialist from day one.
            </p>

            <div className="mt-8 grid grid-cols-[1.25fr_1fr] gap-3 sm:flex sm:flex-wrap">
              <BookTrigger className="btn-blush group min-h-[56px] px-4 text-base shadow-[0_10px_40px_-10px_rgba(251,186,183,.7)] sm:px-7">
                <CalendarCheck className="h-5 w-5" aria-hidden /> <span className="sm:hidden">Book now</span><span className="hidden sm:inline">Book an appointment</span>
              </BookTrigger>
              <a href={generalWhatsappHref} target="_blank" rel="noopener noreferrer" className="btn-wa min-h-[56px] px-4 text-base sm:px-7">
                <WhatsAppIcon className="h-5 w-5" /> WhatsApp<span className="hidden sm:inline">&nbsp;us</span>
              </a>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-4">
              <GoogleBadge />
              <a href={telHref} className="inline-flex min-h-[44px] items-center gap-2 text-[15px] font-semibold text-white/85 underline-offset-4 hover:text-white hover:underline">
                <Phone className="h-4 w-4 text-blush" aria-hidden /> or call {clinic.phone.display}
              </a>
            </div>

            <ul className="mt-8 hidden flex-wrap gap-2.5 text-sm font-semibold text-white/90 sm:flex">
              {[
                { icon: BadgeCheck, text: '2 MDS specialists' },
                { icon: Stethoscope, text: 'Ortho + maxillofacial' },
                { icon: Clock, text: `Open ${clinic.hours.label}` },
              ].map((c) => (
                <li key={c.text} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 backdrop-blur">
                  <c.icon className="h-4 w-4 text-blush" aria-hidden /> {c.text}
                </li>
              ))}
            </ul>
          </div>

          {/* The two specialists */}
          <div className="relative mx-auto w-full max-w-[560px] animate-fade-up [animation-delay:120ms]">
            <div aria-hidden className="absolute left-1/2 top-[46%] -z-10 aspect-square w-[118%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/15 motion-safe:animate-spin-slow" />
            <div aria-hidden className="absolute left-1/2 top-[46%] -z-10 aspect-square w-[86%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-white/[0.02]" />
            <Motif className="pointer-events-none absolute -right-4 -top-10 hidden h-36 w-36 text-blush/30 sm:block" />

            <div className="grid grid-cols-2 items-end gap-4 sm:gap-6">
              <HeroArch doctor={ortho} tone="blush" />
              <HeroArch doctor={maxfax} tone="mint" className="translate-y-6 sm:translate-y-10" />
            </div>

            <FloatChip className="-left-3 top-[18%] animate-float sm:-left-10" dot="bg-blush">
              Braces · Aligners · Invisalign
            </FloatChip>
            <FloatChip className="-right-2 top-[58%] animate-float [animation-delay:1.5s] sm:-right-8" dot="bg-mint">
              Jaw · TMJ · Facial injuries
            </FloatChip>
          </div>
        </div>

        {/* Soft curve into the page */}
        <svg aria-hidden viewBox="0 0 1440 80" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-12 w-full text-paper sm:h-16">
          <path d="M0 80V40C240 8 480 0 720 16s480 40 720 8v56z" fill="currentColor" />
        </svg>
      </section>

      <QuickActions />
    </>
  );
}

function HeroArch({ doctor, tone, className }: { doctor: Doctor; tone: 'blush' | 'mint'; className?: string }) {
  return (
    <Link href={`/doctors/${doctor.slug}`} className={cn('group relative block', className)}>
      <div
        className={cn(
          'relative aspect-[3/4.15] overflow-hidden rounded-t-full rounded-b-[1.75rem] bg-gradient-to-b p-1 ring-1 ring-white/20 transition duration-500 group-hover:-translate-y-1 group-hover:ring-white/40',
          tone === 'blush' ? 'from-blush/30 via-blush/60 to-blush shadow-[0_30px_80px_-30px_rgba(251,186,183,.8)]' : 'from-mint/30 via-mint/60 to-mint shadow-[0_30px_80px_-30px_rgba(209,231,235,.7)]',
        )}
      >
        <div aria-hidden className="absolute inset-x-0 top-0 h-1/2 bg-[radial-gradient(60%_60%_at_50%_30%,rgba(255,255,255,.45),transparent)]" />
        <Photo
          name={doctor.image}
          alt={`${doctor.name}, ${doctor.specialityLabel}`}
          eager
          sizes="(min-width: 1024px) 270px, 45vw"
          className="absolute inset-x-0 bottom-0 h-[90%] w-full object-cover object-top transition duration-700 group-hover:scale-[1.04]"
        />
      </div>
      <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.07] px-3 py-2 backdrop-blur-md sm:px-3.5 sm:py-2.5">
        <p className="text-[13px] font-bold leading-snug text-white sm:truncate sm:text-sm">{doctor.name}</p>
        <p className={cn('text-xs font-semibold sm:truncate', tone === 'blush' ? 'text-blush' : 'text-mint')}>
          {doctor.specialityLabel}<span className="hidden sm:inline"> · MDS</span>
        </p>
      </div>
    </Link>
  );
}

function FloatChip({ children, className, dot }: { children: React.ReactNode; className?: string; dot: string }) {
  return (
    <span className={cn('absolute z-10 hidden items-center gap-2 whitespace-nowrap rounded-full bg-white px-3.5 py-2 text-xs font-bold text-ink shadow-lift motion-reduce:animate-none xs:inline-flex sm:text-sm', className)}>
      <span aria-hidden className={cn('h-2.5 w-2.5 rounded-full ring-2 ring-ink/10', dot)} />
      {children}
    </span>
  );
}

/** Four big, thumb-friendly actions overlapping the hero's bottom edge. */
function QuickActions() {
  const card = 'group flex h-full w-full flex-col items-start gap-3 rounded-2xl border border-line bg-white p-4 text-left shadow-lift transition duration-200 hover:-translate-y-1 hover:border-ink/30 sm:flex-row sm:items-center sm:p-5';
  const tile = 'grid h-12 w-12 shrink-0 place-items-center rounded-xl transition-colors';
  return (
    <section aria-label="Quick actions" className="container-site relative z-10 -mt-16 sm:-mt-24">
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <li>
          <BookTrigger className={card}>
            <span className={cn(tile, 'bg-ink text-white')}>
              <CalendarCheck className="h-5 w-5" aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block font-heading font-semibold text-ink">Book a visit</span>
              <span className="block text-[13px] text-muted sm:truncate sm:text-sm">30-second request</span>
            </span>
          </BookTrigger>
        </li>
        <li>
          <a href={telHref} className={card}>
            <span className={cn(tile, 'bg-blush-soft text-rose group-hover:bg-blush')}>
              <Phone className="h-5 w-5" aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block font-heading font-semibold text-ink">Call the clinic</span>
              <span className="block text-[13px] text-muted sm:truncate sm:text-sm">{clinic.phone.display}</span>
            </span>
          </a>
        </li>
        <li>
          <a href={generalWhatsappHref} target="_blank" rel="noopener noreferrer" className={card}>
            <span className={cn(tile, 'bg-wa/15 text-wa-deep group-hover:bg-wa/25')}>
              <WhatsAppIcon className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block font-heading font-semibold text-ink">WhatsApp</span>
              <span className="block text-[13px] text-muted sm:truncate sm:text-sm">Quick questions</span>
            </span>
          </a>
        </li>
        <li>
          <a href={clinic.mapsUrl} target="_blank" rel="noopener noreferrer" className={card}>
            <span className={cn(tile, 'bg-mint-soft text-teal group-hover:bg-mint')}>
              <Navigation className="h-5 w-5" aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block font-heading font-semibold text-ink">Directions</span>
              <span className="flex items-center gap-1 text-[13px] text-muted sm:truncate sm:text-sm">
                <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden /> NH 16, Tadepalli
              </span>
            </span>
          </a>
        </li>
      </ul>
    </section>
  );
}
