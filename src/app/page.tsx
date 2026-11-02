import { GoogleReviews } from '@/components/GoogleReviews';
import { Hero } from '@/components/home/Hero';
import { ClinicTour, ConcernFinder, CtaBand, Faqs, HowBookingWorks, Specialities, TreatmentTicker, VisitUs } from '@/components/sections';

export default function HomePage() {
  return (
    <>
      <Hero />
      <div className="mt-14">
        <TreatmentTicker />
      </div>
      <Specialities />
      <ConcernFinder />
      <HowBookingWorks />
      <GoogleReviews />
      <ClinicTour />
      <Faqs />
      <VisitUs />
      <CtaBand />
    </>
  );
}
