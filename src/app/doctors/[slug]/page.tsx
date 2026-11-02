import type { Metadata } from 'next';
import Link from 'next/link';
import { BookTrigger } from '@/components/assistant/AssistantProvider';
import { notFound } from 'next/navigation';
import { ArrowLeft, CalendarCheck, Check, Phone } from 'lucide-react';
import { CtaBand } from '@/components/sections';
import { Motif, Photo, Verify, WhatsAppIcon } from '@/components/ui';
import { clinic, telHref } from '@/content/clinic';
import { doctorBySlug, doctors } from '@/content/doctors';
import { treatments } from '@/content/treatments';
import { generalWhatsappHref } from '@/lib/appointment';
import { cn } from '@/lib/cn';

export const dynamicParams = false;
export const generateStaticParams = () => doctors.map((d) => ({ slug: d.slug }));

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const d = doctorBySlug(params.slug);
  if (!d) return {};
  return { title: `${d.name} — ${d.title}`, description: `${d.name}, ${d.qualifications}. ${d.headline} Book at Braces & Faces, Tadepalli.`, alternates: { canonical: `/doctors/${d.slug}` } };
}

export default function DoctorPage({ params }: { params: { slug: string } }) {
  const d = doctorBySlug(params.slug);
  if (!d) notFound();
  const isOrtho = d.speciality === 'orthodontics';
  const list = treatments.filter((t) => t.speciality === d.speciality);
  const other = doctors.find((x) => x.slug !== d.slug)!;

  return (
    <>
      <section className={cn('relative overflow-hidden pb-16 pt-10 sm:pb-24', isOrtho ? 'bg-blush-soft' : 'bg-mint-soft')}>
        <Motif className={cn('pointer-events-none absolute -right-16 top-10 h-80 w-80', isOrtho ? 'text-blush' : 'text-mint')} />
        <div className="container-site relative">
          <Link href="/doctors" className="inline-flex items-center gap-2 text-sm font-semibold text-ink/70 hover:text-ink">
            <ArrowLeft className="h-4 w-4" aria-hidden /> All doctors
          </Link>
          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
            <div className="animate-fade-up">
              <p className={cn('eyebrow', isOrtho ? 'text-rose' : 'text-teal')}>{d.specialityLabel}</p>
              <h1 className="mt-3 text-4xl font-semibold leading-[1.1] sm:text-6xl">{d.name}</h1>
              <p className="mt-3 text-lg font-medium text-ink/80">{d.title}</p>
              <p className="mt-1 text-muted">{d.qualifications}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {d.badges.map((b) => (
                  <li key={b.label} className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-ink ring-1 ring-line">
                    {b.label}
                    <Verify show={b.verify} />
                  </li>
                ))}
              </ul>
              <p className="mt-8 max-w-2xl font-heading text-2xl leading-snug text-ink">{d.headline}</p>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-body">{d.summary}</p>
              <div className="mt-8 flex flex-col gap-3 xs:flex-row xs:flex-wrap">
                <BookTrigger prefill={{ doctor: d.slug }} className="btn-ink"><CalendarCheck className="h-4 w-4" aria-hidden /> Book with {d.name.split(' ').slice(0, 2).join(' ')}</BookTrigger>
                <a href={generalWhatsappHref} target="_blank" rel="noopener noreferrer" className="btn-wa"><WhatsAppIcon className="h-4 w-4" /> WhatsApp</a>
                <a href={telHref} className="btn-ghost"><Phone className="h-4 w-4" aria-hidden /> {clinic.phone.display}</a>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-sm animate-fade-up [animation-delay:120ms]">
              <div className={cn('absolute inset-0 translate-x-4 translate-y-4 rounded-[2rem]', isOrtho ? 'bg-blush' : 'bg-mint')} />
              <Photo name={d.image} alt={`${d.name}, ${d.title}`} priority sizes="384px" className={cn('relative aspect-square w-full rounded-[2rem] object-cover object-top shadow-lift', isOrtho ? 'bg-gradient-to-b from-white to-blush' : 'bg-gradient-to-b from-white to-mint')} />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container-site">
          <h2 className="text-3xl font-semibold sm:text-4xl">Areas of expertise</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {d.focus.map((f) => (
              <div key={f.title} data-reveal className="card p-6">
                <h3 className="text-xl font-semibold">{f.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {f.points.map((p) => (
                    <li key={p} className="flex gap-2.5 text-[15px] text-body">
                      <Check className={cn('mt-0.5 h-4 w-4 shrink-0', isOrtho ? 'text-rose' : 'text-teal')} aria-hidden /> {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <h2 className="mt-20 text-3xl font-semibold sm:text-4xl">Treatments with {d.name.split(' ').slice(0, 2).join(' ')}</h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((t) => (
              <li key={t.id} data-reveal>
                <Link href={`/book?doctor=${d.slug}&treatment=${t.id}`} className="group flex h-full flex-col rounded-2xl border border-line bg-white p-5 transition hover:-translate-y-0.5 hover:border-ink/30 hover:shadow-soft">
                  <span className="font-semibold text-ink">{t.name}<Verify show={t.verify} /></span>
                  <span className="mt-1.5 text-sm leading-relaxed text-muted">{t.blurb}</span>
                  <span className={cn('mt-auto pt-4 text-sm font-semibold', isOrtho ? 'text-rose' : 'text-teal')}>Book for this →</span>
                </Link>
              </li>
            ))}
          </ul>
          {!isOrtho ? (
            <p className="mt-6 max-w-3xl text-sm text-muted">
              Larger operations — such as corrective jaw surgery, cleft repair or cancer surgery — may be carried out in a hospital setting. Dr. Sai Meghana will explain where and how your procedure is planned.
            </p>
          ) : null}

          <div data-reveal className={cn('mt-16 flex flex-col items-start justify-between gap-6 rounded-[1.75rem] p-8 sm:flex-row sm:items-center', isOrtho ? 'bg-mint-soft' : 'bg-blush-soft')}>
            <div className="flex items-center gap-4">
              <Photo name={other.image} alt="" sizes="64px" className={cn('h-16 w-16 rounded-2xl object-cover object-top', isOrtho ? 'bg-mint' : 'bg-blush')} />
              <div>
                <p className="text-sm font-semibold text-muted">Also at Braces &amp; Faces</p>
                <p className="font-heading text-xl text-ink">{other.name} · {other.specialityLabel}</p>
              </div>
            </div>
            <Link href={`/doctors/${other.slug}`} className="btn-ghost">View profile</Link>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
