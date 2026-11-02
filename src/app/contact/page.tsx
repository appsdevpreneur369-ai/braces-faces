import type { Metadata } from 'next';
import { ClinicTour, CtaBand, PageHeader, VisitUs } from '@/components/sections';

export const metadata: Metadata = {
  title: 'Contact & Directions',
  description: 'Braces & Faces Dental Clinic, 2nd floor, near State Bank, NH 16 Service Road, Tadepalli, Vijayawada 522501. Call or WhatsApp +91 88669 22449.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <>
      <PageHeader eyebrow="Contact" title="Come and see us." intro="Call, WhatsApp or drop in during clinic hours. We’re on the 2nd floor, on the NH 16 service road near State Bank." />
      <VisitUs />
      <ClinicTour />
      <CtaBand />
    </>
  );
}
