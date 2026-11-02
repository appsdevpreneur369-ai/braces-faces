import Link from 'next/link';
import { ArrowRight, ArrowUpRight, CalendarCheck, Clock, MapPin, MessageCircle, Phone, Send, Star } from 'lucide-react';
import { clinic, fullAddress, telHref } from '@/content/clinic';
import { type Doctor, doctors } from '@/content/doctors';
import { faqs } from '@/content/faqs';
import { treatments } from '@/content/treatments';
import { generalWhatsappHref } from '@/lib/appointment';
import { cn } from '@/lib/cn';
import { Gallery, type GalleryItem } from './Gallery';
import { MapFacade } from './MapFacade';
import { Motif, Photo, SectionHeading, Verify, WhatsAppIcon } from './ui';

const [ortho, maxfax] = doctors;

/* ─────────────────────────────── Hero ─────────────────────────────── */
export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-ink-deep text-white">
      {/* soft brand glows + fine grid */}
      <div aria-hidden className="absolute -left-32 top-10 -z-10 h-[28rem] w-[28rem] rounded-full bg-blush/25 blur-[120px]" />
      <div aria-hidden className="absolute -right-24 bottom-0 -z-10 h-[26rem] w-[26rem] rounded-full bg-mint/20 blur-[120px]" />
      <div aria-hidden className="absolute inset-0 -z-10 opacity-[0.07] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />

      <div className="container-site grid items-center gap-12 pb-24 pt-12 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pb-28 lg:pt-20">
        <div className="animate-fade-up">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/85">
              <MapPin className="h-3.5 w-3.5 text-blush" aria-hidden /> Tadepalli · Vijayawada
            </span>
          </div>
          <h1 className="mt-6 font-heading text-[2.35rem] font-bold leading-[1.12] tracking-[-0.03em] text-white sm:text-[3.4rem] lg:text-[3.6rem]">
            Specialist care for your{' '}
            <span className="relative whitespace-nowrap text-blush">
              smile
              <svg aria-hidden viewBox="0 0 120 12" className="absolute -bottom-1 left-0 w-full text-blush/70" preserveAspectRatio="none"><path d="M2 9c30-6 80-8 116-3" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" /></svg>
            </span>{' '}
            and your <span className="text-mint">face</span>.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">
            A Maxillofacial &amp; Orthodontic Centre where an orthodontist and an oral &amp; maxillofacial surgeon work side by side — from braces and Invisalign to jaw surgery, TMJ care and facial trauma.
          </p>
          <div className="mt-8 flex flex-col gap-3 xs:flex-row xs:flex-wrap">
            <Link href="/book" className="btn-blush text-base">
              <CalendarCheck className="h-5 w-5" aria-hidden /> Book an appointment
            </Link>
            <a href={generalWhatsappHref} target="_blank" rel="noopener noreferrer" className="btn-wa text-base">
              <WhatsAppIcon className="h-5 w-5" /> WhatsApp us
            </a>
          </div>
          <a href={telHref} className="mt-4 inline-flex min-h-[44px] items-center gap-2 text-[15px] font-semibold text-white/80 underline-offset-4 hover:text-white hover:underline">
            <Phone className="h-4 w-4 text-blush" aria-hidden /> or call {clinic.phone.display}
          </a>
          <dl className="mt-10 grid max-w-lg grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur">
            <div className="px-4 py-4">
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-white/55">Google</dt>
              <dd className="mt-1 flex items-center gap-1 font-heading text-2xl text-white">
                {clinic.google.rating} <Star className="h-4 w-4 fill-[#FBBC04] text-[#FBBC04]" aria-hidden />
              </dd>
            </div>
            <div className="px-4 py-4">
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-white/55">Specialists</dt>
              <dd className="mt-1 font-heading text-2xl text-white">2 MDS</dd>
            </div>
            <div className="px-4 py-4">
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-white/55">Hours</dt>
              <dd className="mt-1 font-heading text-2xl text-white">10–8</dd>
            </div>
          </dl>
        </div>

        {/* Visual: the two specialists in arches — blush = orthodontics (the tooth), mint = maxillofacial (the face) */}
        <div className="relative mx-auto w-full max-w-[560px] animate-fade-up [animation-delay:150ms]">
          <Motif className="pointer-events-none absolute -right-6 -top-8 hidden h-40 w-40 text-blush/30 sm:block" />
          <div className="grid grid-cols-2 items-end gap-4 sm:gap-5">
            <HeroArch doctor={ortho} tone="blush" />
            <HeroArch doctor={maxfax} tone="mint" className="translate-y-10" />
          </div>
          <div className="absolute -left-2 top-3 flex animate-float items-center gap-2 whitespace-nowrap rounded-full bg-white px-3.5 py-2 text-xs font-semibold text-ink shadow-lift sm:-left-6 sm:text-sm">
            <Star className="h-4 w-4 fill-[#FBBC04] text-[#FBBC04]" aria-hidden /> {clinic.google.rating} on Google
            <span className="text-muted">· {clinic.google.reviewCount} reviews</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroArch({ doctor, tone, className }: { doctor: Doctor; tone: 'blush' | 'mint'; className?: string }) {
  return (
    <Link href={`/doctors/${doctor.slug}`} className={cn('group relative block', className)}>
      <div
        className={cn(
          'relative aspect-[3/4.2] overflow-hidden rounded-t-full rounded-b-[1.75rem] bg-gradient-to-b ring-1 ring-white/15',
          tone === 'blush' ? 'from-blush/40 to-blush' : 'from-mint/40 to-mint',
        )}
      >
        <Photo
          name={doctor.image}
          alt={`${doctor.name}, ${doctor.specialityLabel}`}
          eager
          sizes="(min-width: 1024px) 270px, 45vw"
          className="absolute inset-x-0 bottom-0 h-[88%] w-full object-cover object-top transition duration-700 group-hover:scale-[1.03]"
        />
      </div>
      <div className="mt-3 rounded-2xl bg-white/[0.06] px-3 py-2.5 ring-1 ring-white/10 backdrop-blur">
        <p className="truncate text-sm font-bold text-white">{doctor.name}</p>
        <p className={cn('truncate text-xs font-semibold', tone === 'blush' ? 'text-blush' : 'text-mint')}>{doctor.specialityLabel}</p>
      </div>
    </Link>
  );
}

/* ─────────────────────────── Treatment ticker ─────────────────────────── */
export function TreatmentTicker() {
  const row = [...treatments, ...treatments];
  return (
    <div className="relative overflow-hidden border-y border-line bg-white py-4" aria-label="Treatments we offer">
      <div className="flex w-max animate-marquee gap-8 hover:[animation-play-state:paused] motion-reduce:animate-none">
        {row.map((t, i) => (
          <Link key={`${t.id}-${i}`} href={`/treatments#${t.id}`} tabIndex={i >= treatments.length ? -1 : undefined} aria-hidden={i >= treatments.length ? true : undefined} className="flex items-center gap-3 whitespace-nowrap font-heading text-lg text-ink/80 hover:text-ink">
            <span aria-hidden className={cn('h-2 w-2 rounded-full', t.speciality === 'orthodontics' ? 'bg-blush' : 'bg-teal/60')} />
            {t.name}
          </Link>
        ))}
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white" />
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white" />
    </div>
  );
}

/* ─────────────────────────── Two specialities ─────────────────────────── */
export function Specialities() {
  return (
    <section id="specialities" className="py-20 sm:py-28">
      <div className="container-site">
        <SectionHeading
          eyebrow="Two specialities · one centre"
          title={<>Where the <span className="text-rose">braces</span> meet the <span className="text-teal">faces</span>.</>}
          intro="Most dental clinics are built around general dentistry. Ours is built around two specialities that often need each other — moving teeth, and treating the jaws and face that hold them."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {doctors.map((d) => (
            <SpecialityCard key={d.slug} doctor={d} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SpecialityCard({ doctor }: { doctor: Doctor }) {
  const isOrtho = doctor.speciality === 'orthodontics';
  return (
    <article data-reveal className={cn('group relative flex flex-col overflow-hidden rounded-[1.75rem] p-6 sm:p-8', isOrtho ? 'bg-blush-soft' : 'bg-mint-soft')}>
      <Motif className={cn('pointer-events-none absolute -right-12 -top-12 h-56 w-56 opacity-50', isOrtho ? 'text-blush' : 'text-mint')} />
      <div className="relative flex items-start gap-5">
        <Photo name={doctor.image} alt={`${doctor.name}, ${doctor.specialityLabel}`} sizes="112px" className={cn('h-24 w-24 shrink-0 rounded-2xl object-cover object-top sm:h-28 sm:w-28', isOrtho ? 'bg-blush' : 'bg-mint')} />
        <div>
          <p className={cn('eyebrow', isOrtho ? 'text-rose' : 'text-teal')}>{doctor.specialityLabel}</p>
          <h3 className="mt-2 text-2xl font-semibold leading-tight sm:text-[1.7rem]">{doctor.name}</h3>
          <p className="mt-1 text-sm font-medium text-muted">{doctor.qualifications}</p>
        </div>
      </div>
      <p className="relative mt-6 font-heading text-xl text-ink">{doctor.headline}</p>
      <ul className="relative mt-5 flex flex-wrap gap-2">
        {doctor.knownFor.map((k) => (
          <li key={k} className="rounded-full bg-white/80 px-3 py-1.5 text-sm font-semibold text-ink ring-1 ring-ink/5">{k}</li>
        ))}
      </ul>
      <div className="relative mt-auto flex flex-wrap gap-3 pt-8">
        <Link href={`/book?doctor=${doctor.slug}`} className="btn-ink min-h-[44px] px-5 text-sm">
          <CalendarCheck className="h-4 w-4" aria-hidden /> Book with {doctor.name.split(' ').slice(0, 2).join(' ')}
        </Link>
        <Link href={`/doctors/${doctor.slug}`} className="inline-flex min-h-[44px] items-center gap-1.5 px-2 text-sm font-semibold text-ink hover:gap-2.5">
          Full profile <ArrowRight className="h-4 w-4 transition-all" aria-hidden />
        </Link>
      </div>
    </article>
  );
}

/* ─────────────────────────── Concern finder ─────────────────────────── */
const CONCERNS: { label: string; hint: string; doctor: Doctor; treatment?: string }[] = [
  { label: 'Crooked or gapped teeth', hint: 'Braces or aligners', doctor: ortho, treatment: 'aligners' },
  { label: 'I want “invisible” braces', hint: 'Invisalign / clear aligners', doctor: ortho, treatment: 'invisalign' },
  { label: 'My child sucks a thumb', hint: 'Habit-breaking therapy', doctor: ortho, treatment: 'habit-breaking' },
  { label: 'I grind my teeth at night', hint: 'Bruxism care, night guard', doctor: ortho, treatment: 'bruxism' },
  { label: 'I play contact sports', hint: 'Custom mouth guard', doctor: ortho, treatment: 'mouth-guards' },
  { label: 'Jaw clicks or hurts', hint: 'TMJ assessment', doctor: maxfax, treatment: 'tmj' },
  { label: 'Injury to the face or jaw', hint: 'Facial trauma care', doctor: maxfax, treatment: 'facial-trauma' },
  { label: 'A swelling on my face', hint: 'Swelling evaluation', doctor: maxfax, treatment: 'facial-swellings' },
  { label: 'Ulcer or patch that won’t heal', hint: 'Oral cancer screening', doctor: maxfax, treatment: 'oral-cancer' },
  { label: 'Upper / lower jaw sticks out', hint: 'Braces + jaw surgery plan', doctor: maxfax, treatment: 'jaw-surgery' },
];

export function ConcernFinder() {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-28">
      <div className="container-site grid gap-12 lg:grid-cols-[0.9fr_1.4fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            eyebrow="Not sure who to see?"
            title="Start with what’s bothering you."
            intro="Tap the concern closest to yours. We’ll open the booking form with the right specialist already selected."
          />
          <div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold">
            <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-blush" /> {ortho.name}</span>
            <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-teal/60" /> {maxfax.name}</span>
          </div>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {CONCERNS.map((c) => {
            const isOrtho = c.doctor.speciality === 'orthodontics';
            return (
              <li key={c.label} data-reveal>
                <Link
                  href={`/book?doctor=${c.doctor.slug}${c.treatment ? `&treatment=${c.treatment}` : ''}`}
                  className={cn(
                    'group flex h-full items-center justify-between gap-4 rounded-2xl border bg-paper p-5 transition hover:-translate-y-0.5 hover:shadow-soft',
                    isOrtho ? 'border-blush/60 hover:border-rose' : 'border-mint hover:border-teal',
                  )}
                >
                  <span>
                    <span className="block font-semibold text-ink">{c.label}</span>
                    <span className={cn('mt-1 block text-sm', isOrtho ? 'text-rose' : 'text-teal')}>{c.hint}</span>
                  </span>
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-ink/40 transition group-hover:rotate-45 group-hover:text-ink" aria-hidden />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ─────────────────────────── How booking works ─────────────────────────── */
export function HowBookingWorks() {
  const steps = [
    { icon: CalendarCheck, title: 'Fill a 30-second form', body: 'Pick the doctor, a day and a time that suits you. Add a note if you like.' },
    { icon: Send, title: 'WhatsApp opens, ready to send', body: 'Your details appear as a neat message to the clinic. Check it and press send.' },
    { icon: MessageCircle, title: 'We confirm your slot', body: 'The clinic replies on WhatsApp or calls you back to confirm the time.' },
  ];
  return (
    <section className="relative overflow-hidden bg-ink py-20 text-white sm:py-24">
      <div aria-hidden className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-blush/15 blur-3xl" />
      <div className="container-site relative">
        <SectionHeading dark eyebrow="Booking, made simple" title="No apps. No logins. Just WhatsApp." align="center" intro="Prefer to talk to a person? Call us — the same team answers." />
        <ol className="mt-14 grid gap-5 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} data-reveal className="relative rounded-card border border-white/10 bg-white/[0.04] p-7 backdrop-blur">
              <span className="absolute right-6 top-5 font-heading text-6xl text-white/10">{i + 1}</span>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blush text-ink-deep">
                <s.icon className="h-6 w-6" aria-hidden />
              </span>
              <h3 className="mt-6 text-xl font-semibold text-white">{s.title}</h3>
              <p className="mt-2 leading-relaxed text-white/70">{s.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-12 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/book" className="btn-blush text-base"><CalendarCheck className="h-5 w-5" aria-hidden /> Book an appointment</Link>
          <a href={telHref} className="btn-ghost-dark text-base"><Phone className="h-5 w-5" aria-hidden /> Call {clinic.phone.display}</a>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── Clinic tour ─────────────────────────── */
export const TOUR: GalleryItem[] = [
  { name: 'clinic-waiting-room', alt: 'Waiting lounge with seating, the reception desk and the clinic’s wall art', caption: 'Waiting lounge' },
  { name: 'clinic-operatory', alt: 'Dental chair with overhead light and monitor in a glass-walled treatment room', caption: 'Treatment suite' },
  { name: 'clinic-reception', alt: 'Marble reception desk decorated with flowers on opening day', caption: 'Reception — opening day' },
  { name: 'clinic-reception-desk', alt: 'Reception desk, TV screen and a clear-aligner information stand', caption: 'Front desk' },
  { name: 'clinic-operatory-2', alt: 'Second view of the treatment chair, assistant stool and suction unit', caption: 'Ergonomic dental chair' },
  { name: 'clinic-exterior', alt: 'Building on NH 16 Service Road showing the Braces & Faces signboard', caption: 'Find us on NH 16 Service Road' },
  { name: 'clinic-operatory-3', alt: 'Dental chair with intra-oral camera monitor and instrument tray', caption: 'Chairside screen' },
];

export function ClinicTour() {
  return (
    <section id="tour" className="py-20 sm:py-28">
      <div className="container-site">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow="Clinic tour" title="Calm, bright and spotless." intro="Take a look around before you visit. Tap any photo to open it." />
          <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-ink hover:gap-3">
            How to reach us <ArrowRight className="h-4 w-4 transition-all" aria-hidden />
          </Link>
        </div>
        <div className="mt-10">
          <Gallery items={TOUR} />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── Google rating ─────────────────────────── */
export function GoogleRating() {
  return (
    <section className="bg-white py-16">
      <div className="container-site">
        <div data-reveal className="relative overflow-hidden rounded-[2rem] bg-lavender-soft px-6 py-10 sm:px-12">
          <Motif className="pointer-events-none absolute -bottom-16 -right-10 h-64 w-64 text-lavender/40" />
          <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="flex items-center gap-6">
              <p className="font-heading text-6xl font-semibold text-ink sm:text-7xl">{clinic.google.rating}</p>
              <div>
                <p className="flex gap-1" role="img" aria-label={`${clinic.google.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-[#FBBC04] text-[#FBBC04]" aria-hidden />
                  ))}
                </p>
                <p className="mt-2 font-semibold text-ink">
                  Rated on Google by {clinic.google.reviewCount} patients
                  <Verify show={clinic.google.verify} />
                </p>
                <p className="text-sm text-muted">Every review is from a real Google account — read them in full on Google.</p>
              </div>
            </div>
            <a href={clinic.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-ink">
              Read our Google reviews <ArrowUpRight className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── FAQs ─────────────────────────── */
export function Faqs() {
  return (
    <section id="faqs" className="py-20 sm:py-28">
      <div className="container-site grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <SectionHeading eyebrow="Good to know" title="Questions patients ask us." intro="Can’t find yours? Send it on WhatsApp — we’ll answer." />
          <a href={generalWhatsappHref} target="_blank" rel="noopener noreferrer" className="btn-wa mt-8">
            <WhatsAppIcon className="h-5 w-5" /> Ask on WhatsApp
          </a>
        </div>
        <div className="divide-y divide-line rounded-card border border-line bg-white">
          {faqs.map((f) => (
            <details key={f.q} className="group px-6 py-1 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex min-h-[64px] cursor-pointer list-none items-center justify-between gap-4 py-4 font-semibold text-ink">
                {f.q}
                <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-lavender-soft text-lg text-ink transition group-open:rotate-45 group-open:bg-ink group-open:text-white">+</span>
              </summary>
              <p className="pb-5 pr-10 leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── Visit us ─────────────────────────── */
export function VisitUs() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="container-site grid gap-10 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Visit us" title="2nd floor, right on NH 16." intro="Near State Bank on the NH 16 service road in Tadepalli — easy to reach from Vijayawada, Mangalagiri and Guntur." accent="teal" />
          <ul className="mt-8 space-y-5">
            <li className="flex gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-mint-soft text-teal"><MapPin className="h-5 w-5" aria-hidden /></span>
              <div>
                <p className="font-semibold text-ink">Address<Verify show={clinic.address.verify} /></p>
                <p className="text-muted">{fullAddress}</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-mint-soft text-teal"><Clock className="h-5 w-5" aria-hidden /></span>
              <div>
                <p className="font-semibold text-ink">Clinic hours<Verify show={clinic.hours.verifyDays} /></p>
                <p className="text-muted">{clinic.hours.label}</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-mint-soft text-teal"><Phone className="h-5 w-5" aria-hidden /></span>
              <div>
                <p className="font-semibold text-ink">Phone &amp; WhatsApp<Verify show={clinic.whatsapp.verify} /></p>
                <a href={telHref} className="text-muted hover:text-ink">{clinic.phone.display}</a>
              </div>
            </li>
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={telHref} className="btn-ink"><Phone className="h-4 w-4" aria-hidden /> Call now</a>
            <a href={generalWhatsappHref} target="_blank" rel="noopener noreferrer" className="btn-wa"><WhatsAppIcon className="h-4 w-4" /> WhatsApp</a>
          </div>
        </div>
        <div data-reveal>
          <MapFacade />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── Closing CTA ─────────────────────────── */
export function CtaBand() {
  return (
    <section className="py-16">
      <div className="container-site">
        <div data-reveal className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-ink via-ink-soft to-ink-deep px-6 py-12 text-center text-white sm:px-12 sm:py-16">
          <div aria-hidden className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-blush/25 blur-3xl" />
          <div aria-hidden className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-mint/20 blur-3xl" />
          <h2 className="relative mx-auto max-w-2xl text-3xl font-semibold text-white sm:text-5xl">Your first step is a conversation.</h2>
          <p className="relative mx-auto mt-4 max-w-xl text-lg text-white/75">Tell us what’s bothering you. We’ll match you with the right specialist and a time that works.</p>
          <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/book" className="btn-blush text-base"><CalendarCheck className="h-5 w-5" aria-hidden /> Book an appointment</Link>
            <a href={generalWhatsappHref} target="_blank" rel="noopener noreferrer" className="btn-wa text-base"><WhatsAppIcon className="h-5 w-5" /> WhatsApp</a>
            <a href={telHref} className="btn-ghost-dark text-base"><Phone className="h-5 w-5" aria-hidden /> Call</a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── Page header (inner pages) ─────────────────────────── */
export function PageHeader({ eyebrow, title, intro }: { eyebrow: string; title: React.ReactNode; intro?: string }) {
  return (
    <section className="relative overflow-hidden bg-ink-deep pb-14 pt-12 text-white sm:pb-20 sm:pt-16">
      <div aria-hidden className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-blush/20 blur-[100px]" />
      <div aria-hidden className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-mint/15 blur-[100px]" />
      <Motif className="pointer-events-none absolute -right-8 top-6 hidden h-48 w-48 text-white/10 md:block" />
      <div className="container-site relative animate-fade-up">
        <p className="eyebrow text-blush"><span aria-hidden className="h-px w-6 bg-blush" />{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-[1.12] text-white sm:text-[3.4rem]">{title}</h1>
        {intro ? <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/75">{intro}</p> : null}
      </div>
    </section>
  );
}
