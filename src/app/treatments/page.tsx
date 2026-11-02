import type { Metadata } from 'next';
import Link from 'next/link';
import { CalendarCheck } from 'lucide-react';
import { CtaBand, PageHeader } from '@/components/sections';
import { Photo, Verify } from '@/components/ui';
import { doctorBySlug } from '@/content/doctors';
import { specialityMeta, treatments } from '@/content/treatments';
import { cn } from '@/lib/cn';

export const metadata: Metadata = {
  title: 'Treatments',
  description: 'Invisalign, clear aligners, Pitts and self-ligating braces, night guards, facial trauma, corrective jaw surgery, TMJ, cleft lip & palate and more at Braces & Faces, Tadepalli.',
  alternates: { canonical: '/treatments' },
};

export default function TreatmentsPage() {
  return (
    <>
      <PageHeader eyebrow="Treatments" title="Everything we treat, in one place." intro="Grouped by speciality, so you can see which doctor looks after what. Tap any treatment to book it." />
      <nav aria-label="Specialities" className="sticky top-[72px] z-30 border-b border-line bg-white/90 backdrop-blur">
        <div className="container-site no-scrollbar flex gap-2 overflow-x-auto py-3">
          {(['orthodontics', 'maxillofacial'] as const).map((s) => (
            <a key={s} href={`#${s}`} className={cn('whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold', s === 'orthodontics' ? 'bg-blush-soft text-rose' : 'bg-mint-soft text-teal')}>
              {specialityMeta[s].label}
            </a>
          ))}
        </div>
      </nav>
      {(['orthodontics', 'maxillofacial'] as const).map((s) => {
        const meta = specialityMeta[s];
        const doc = doctorBySlug(meta.doctorSlug)!;
        const isOrtho = s === 'orthodontics';
        return (
          <section key={s} id={s} className={cn('py-16 sm:py-24', !isOrtho && 'bg-white')}>
            <div className="container-site">
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <div data-reveal className="max-w-2xl">
                  <p className={cn('eyebrow', isOrtho ? 'text-rose' : 'text-teal')}>{meta.label}</p>
                  <h2 className="mt-3 text-3xl font-semibold leading-[1.15] sm:text-[2.6rem]">{meta.strap}</h2>
                </div>
                <Link href={`/doctors/${doc.slug}`} className="flex items-center gap-3 rounded-2xl bg-white p-2 pr-5 ring-1 ring-line hover:ring-ink/30">
                  <Photo name={doc.image} alt="" sizes="48px" className={cn('h-12 w-12 rounded-xl object-cover object-top', isOrtho ? 'bg-blush' : 'bg-mint')} />
                  <span>
                    <span className="block text-xs font-semibold text-muted">Your specialist</span>
                    <span className="block font-semibold text-ink">{doc.name}</span>
                  </span>
                </Link>
              </div>
              <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {treatments
                  .filter((t) => t.speciality === s)
                  .map((t, i) => (
                    <li key={t.id} id={t.id} data-reveal>
                      <article className="group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-white p-6 transition hover:-translate-y-1 hover:shadow-lift">
                        <span aria-hidden className={cn('absolute right-5 top-4 font-heading text-4xl', isOrtho ? 'text-rose/80' : 'text-teal/80')}>{String(i + 1).padStart(2, '0')}</span>
                        <h3 className="pr-12 text-xl font-semibold">{t.name}<Verify show={t.verify} /></h3>
                        <p className="mt-3 leading-relaxed text-muted">{t.blurb}</p>
                        {t.hospital ? <p className="mt-3 text-xs font-semibold text-ink/60">May be planned in a hospital setting</p> : null}
                        <Link href={`/book?doctor=${doc.slug}&treatment=${t.id}`} className={cn('mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold', isOrtho ? 'text-rose' : 'text-teal')}>
                          <CalendarCheck className="h-4 w-4" aria-hidden /> Book a consultation
                        </Link>
                      </article>
                    </li>
                  ))}
              </ul>
            </div>
          </section>
        );
      })}
      <CtaBand />
    </>
  );
}
