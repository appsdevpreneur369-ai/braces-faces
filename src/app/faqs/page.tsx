import type { Metadata } from 'next';
import { CtaBand, Faqs, PageHeader } from '@/components/sections';
import { faqs } from '@/content/faqs';

export const metadata: Metadata = {
  title: 'FAQs',
  description: 'Answers to common questions about booking, braces, aligners, jaw surgery and your first visit at Braces & Faces, Tadepalli.',
  alternates: { canonical: '/faqs' },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};

export default function FaqsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <PageHeader eyebrow="FAQs" title="Your questions, answered." intro="Booking, braces, aligners, surgery and your first visit — answered in plain words." />
      <Faqs />
      <CtaBand />
    </>
  );
}
