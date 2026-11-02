import type { Metadata } from 'next';
import { Gallery } from '@/components/Gallery';
import { CtaBand, PageHeader, TOUR, VisitUs } from '@/components/sections';

export const metadata: Metadata = {
  title: 'Clinic Gallery',
  description: 'Look around Braces & Faces Dental Clinic in Tadepalli — the waiting lounge, reception and treatment suites — before your visit.',
  alternates: { canonical: '/gallery' },
};

export default function GalleryPage() {
  return (
    <>
      <PageHeader eyebrow="Gallery" title="Take a look around." intro="Our waiting lounge, reception and treatment rooms — so the clinic feels familiar before you arrive. Tap any photo to open it." />
      <section className="py-16 sm:py-24">
        <div className="container-site">
          <Gallery items={TOUR} aboveFold />
        </div>
      </section>
      <VisitUs />
      <CtaBand />
    </>
  );
}
