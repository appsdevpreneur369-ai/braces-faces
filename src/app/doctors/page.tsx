import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CalendarCheck } from 'lucide-react';
import { CtaBand, PageHeader } from '@/components/sections';
import { Photo, Verify } from '@/components/ui';
import { doctors } from '@/content/doctors';
import { cn } from '@/lib/cn';

export const metadata: Metadata = {
  title: 'Our Doctors',
  description: 'Meet Dr. Bharghav Rayala, Consultant Orthodontist, and Dr. Sai Meghana Yarlagadda, Consultant Oral & Maxillofacial Surgeon, at Braces & Faces, Tadepalli.',
};

export default function DoctorsPage() {
  return (
    <>
      <PageHeader eyebrow="Our doctors" title="Two specialists who plan together." intro="Some problems need an orthodontist, some need a surgeon — and some need both. Here, both are in the same clinic." />
      <section className="py-16 sm:py-24">
        <div className="container-site grid gap-8">
          {doctors.map((d, i) => {
            const isOrtho = d.speciality === 'orthodontics';
            return (
              <article key={d.slug} data-reveal className={cn('grid overflow-hidden rounded-[2rem] border border-line bg-white shadow-soft', i % 2 === 1 ? 'md:grid-cols-[1fr_320px]' : 'md:grid-cols-[320px_1fr]')}>
                <div className={cn('relative min-h-[300px]', isOrtho ? 'bg-gradient-to-b from-blush-soft to-blush' : 'bg-gradient-to-b from-mint-soft to-mint', i % 2 === 1 && 'md:order-2')}>
                  <Photo name={d.image} alt={`${d.name}, ${d.title}`} sizes="(min-width: 768px) 320px, 100vw" className="absolute inset-x-0 bottom-0 h-full w-full object-contain object-bottom" />
                </div>
                <div className="p-6 sm:p-10">
                  <p className={cn('eyebrow', isOrtho ? 'text-rose' : 'text-teal')}>{d.specialityLabel}</p>
                  <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">{d.name}</h2>
                  <p className="mt-1 font-medium text-ink/80">{d.title}</p>
                  <p className="mt-1 text-sm text-muted">{d.qualifications}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {d.badges.map((b) => (
                      <li key={b.label} className="rounded-full bg-paper px-3 py-1 text-sm font-semibold text-ink ring-1 ring-line">
                        {b.label}
                        <Verify show={b.verify} />
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 leading-relaxed text-body">{d.summary}</p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link href={`/book?doctor=${d.slug}`} className="btn-ink"><CalendarCheck className="h-4 w-4" aria-hidden /> Book appointment</Link>
                    <Link href={`/doctors/${d.slug}`} className="btn-ghost">Full profile <ArrowRight className="h-4 w-4" aria-hidden /></Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
