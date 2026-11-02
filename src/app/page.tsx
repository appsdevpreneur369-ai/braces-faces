import { ClinicTour, ConcernFinder, CtaBand, Faqs, GoogleRating, Hero, HowBookingWorks, Specialities, TreatmentTicker, VisitUs } from '@/components/sections';

export default function HomePage() {
  return (
    <>
      <Hero />
      <TreatmentTicker />
      <Specialities />
      <ConcernFinder />
      <HowBookingWorks />
      <ClinicTour />
      <GoogleRating />
      <Faqs />
      <VisitUs />
      <CtaBand />
    </>
  );
}
