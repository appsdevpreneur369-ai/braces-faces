import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CalendarCheck, ClipboardList, Handshake, MapPin, MessageCircle, Stethoscope } from 'lucide-react';
import { BookTrigger } from '@/components/assistant/AssistantProvider';
import { GoogleReviews } from '@/components/GoogleReviews';
import { CtaBand, PageHeader } from '@/components/sections';
import { Motif, Photo, SectionHeading } from '@/components/ui';
import { clinic } from '@/content/clinic';
import { doctors } from '@/content/doctors';
import { cn } from '@/lib/cn';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Braces & Faces is a Maxillofacial & Orthodontic Centre in Tadepalli, Vijayawada, where an orthodontist and an oral & maxillofacial surgeon work side by side.',
  alternates: { canonical: '/about' },
};

const VALUES = [
  { icon: Stethoscope, title: 'Specialist-led from day one', text: 'Your first visit is with an MDS specialist in the problem you came with — not a referral later.' },
  { icon: ClipboardList, title: 'You see the plan first', text: 'We explain what we found, the options and the steps before any treatment begins.' },
  { icon: Handshake, title: 'Two specialities, one plan', text: 'When teeth and jaws both need work, the orthodontist and the surgeon plan it together.' },
  { icon: MessageCircle, title: 'Easy to reach', text: 'On the NH 16 service road in Tadepalli. Book on WhatsApp or just call the clinic.' },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About us"
        title="Where the braces meet the faces."
        intro={`${clinic.name} is a ${clinic.centre.toLowerCase()} in Tadepalli — built around two specialities that often need each other.`}
      />

      <section className="py-16 sm:py-24">
        <div className="container-site grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div data-reveal>
            <p className="eyebrow text-rose">
              <span aria-hidden className="h-px w-6 bg-rose" /> Our story
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-[1.15] sm:text-[2.6rem]">Why one centre for smiles and faces?</h2>
            <p className="mt-6 text-lg font-semibold leading-relaxed text-ink">
              Many problems sit right on the line between moving teeth and treating the jaws and face that hold them.
            </p>
            <p className="mt-4 leading-relaxed text-muted">
              A lower jaw that sits forward, a bite that does not close, jaw-joint pain that keeps coming back, or a face injury that
              has disturbed the teeth — each can need both an orthodontist and an oral &amp; maxillofacial surgeon. When the two work
              in different places, patients carry reports back and forth and plans can drift apart.
            </p>
            <p className="mt-4 leading-relaxed text-muted">
              At {clinic.shortName}, both specialists work in the same clinic. Simple cases stay simple. Complex ones get one plan,
              agreed between the two doctors, explained to you before anything starts.
            </p>
          </div>
          <figure data-reveal className="relative">
            <Motif className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 text-blush/40" />
            <Photo name="clinic-waiting-room" alt="The clinic’s waiting lounge and reception" sizes="(min-width:1024px) 40vw, 100vw" className="relative aspect-[4/3] w-full rounded-[2rem] object-cover shadow-lift" />
            <figcaption className="mt-3 flex items-center gap-2 text-sm text-muted">
              <MapPin className="h-4 w-4 text-rose" aria-hidden /> 2nd floor, NH 16 Service Road, Tadepalli
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="relative overflow-hidden bg-ink-deep py-16 text-white sm:py-24">
        <div aria-hidden className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-blush/15 blur-[100px]" />
        <div aria-hidden className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-mint/15 blur-[100px]" />
        <div className="container-site relative">
          <SectionHeading dark eyebrow="The specialists" title="Meet the two doctors behind the name." />
          <ul className="mt-12 grid gap-6 md:grid-cols-2">
            {doctors.map((d) => {
              const isOrtho = d.speciality === 'orthodontics';
              return (
                <li key={d.slug} data-reveal className="flex flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.05] backdrop-blur sm:flex-row">
                  <div className={cn('relative shrink-0 sm:w-48', isOrtho ? 'bg-gradient-to-b from-blush/40 to-blush' : 'bg-gradient-to-b from-mint/40 to-mint')}>
                    <Photo name={d.image} alt={`${d.name}, ${d.specialityLabel}`} sizes="(min-width:640px) 192px, 100vw" className="mx-auto h-60 w-auto object-contain object-bottom sm:absolute sm:inset-x-0 sm:bottom-0 sm:h-[95%] sm:w-full sm:object-cover sm:object-top" />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className={cn('eyebrow', isOrtho ? 'text-blush' : 'text-mint')}>{d.specialityLabel}</p>
                    <h3 className="mt-2 text-2xl font-semibold leading-tight text-white">{d.name}</h3>
                    <p className="mt-1 text-sm text-white/65">{d.qualifications}</p>
                    <p className="mt-4 text-white/80">{d.headline}</p>
                    <div className="mt-auto flex flex-wrap gap-3 pt-6">
                      <BookTrigger prefill={{ doctor: d.slug }} className="btn-blush min-h-[44px] px-5 text-sm">
                        <CalendarCheck className="h-4 w-4" aria-hidden /> Book
                      </BookTrigger>
                      <Link href={`/doctors/${d.slug}`} className="btn-ghost-dark min-h-[44px] px-5 text-sm">
                        Full profile <ArrowRight className="h-4 w-4" aria-hidden />
                      </Link>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container-site">
          <SectionHeading eyebrow="What to expect" title="How we look after you." />
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <li key={v.title} data-reveal className="card p-6">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-lavender-soft text-ink">
                  <v.icon className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="mt-5 text-lg font-semibold leading-snug">{v.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{v.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <GoogleReviews />
      <CtaBand />
    </>
  );
}
