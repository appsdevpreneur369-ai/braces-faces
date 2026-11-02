import Link from 'next/link';
import { ArrowRight, ArrowUpRight, CalendarCheck, Clock, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { clinic, fullAddress, telHref } from '@/content/clinic';
import { type Doctor, doctors } from '@/content/doctors';
import { CONCERNS } from '@/content/concerns';
import { faqs } from '@/content/faqs';
import { treatments } from '@/content/treatments';
import { generalWhatsappHref } from '@/lib/appointment';
import { cn } from '@/lib/cn';
import { BookTrigger } from './assistant/AssistantProvider';
import { Gallery, type GalleryItem } from './Gallery';
import { MapFacade } from './MapFacade';
import { Motif, Photo, SectionHeading, Verify, WhatsAppIcon } from './ui';

const [ortho, maxfax] = doctors;

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
        <BookTrigger prefill={{ doctor: doctor.slug }} className="btn-ink min-h-[44px] px-5 text-sm">
          <CalendarCheck className="h-4 w-4" aria-hidden /> Book with {doctor.name.split(' ').slice(0, 2).join(' ')}
        </BookTrigger>
        <Link href={`/doctors/${doctor.slug}`} className="inline-flex min-h-[44px] items-center gap-1.5 px-2 text-sm font-semibold text-ink hover:gap-2.5">
          Full profile <ArrowRight className="h-4 w-4 transition-all" aria-hidden />
        </Link>
      </div>
    </article>
  );
}

/* ─────────────────────────── Concern finder ─────────────────────────── */


export function ConcernFinder() {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-28">
      <div className="container-site grid gap-12 lg:grid-cols-[0.9fr_1.4fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            eyebrow="Not sure who to see?"
            title="Start with what’s bothering you."
            intro="Tap the concern closest to yours. We’ll suggest the right specialist and help you pick a time — in about 30 seconds."
          />
          <div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold">
            <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-blush" /> {ortho.name}</span>
            <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-teal/60" /> {maxfax.name}</span>
          </div>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {CONCERNS.map((c) => {
            const isOrtho = c.doctor?.speciality === 'orthodontics';
            return (
              <li key={c.label} data-reveal>
                <BookTrigger
                  prefill={{ concern: c.id }}
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
                </BookTrigger>
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
          <BookTrigger className="btn-blush text-base"><CalendarCheck className="h-5 w-5" aria-hidden /> Book an appointment</BookTrigger>
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
            <BookTrigger className="btn-blush text-base"><CalendarCheck className="h-5 w-5" aria-hidden /> Book an appointment</BookTrigger>
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
