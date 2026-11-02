import type { Metadata } from 'next';
import { Clock, MapPin, Phone } from 'lucide-react';
import { BookingForm } from '@/components/BookingForm';
import { OpenNow } from '@/components/client';
import { Verify } from '@/components/ui';
import { clinic, fullAddress, telHref } from '@/content/clinic';

export const metadata: Metadata = {
  title: 'Book an Appointment',
  description: 'Request an appointment with our orthodontist or maxillofacial surgeon in Tadepalli. Send your details on WhatsApp or call +91 88669 22449.',
};

export default function BookPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-ink-deep pb-40 pt-12 text-white sm:pt-16">
        <div aria-hidden className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-blush/20 blur-[100px]" />
        <div aria-hidden className="absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-mint/15 blur-[100px]" />
        <div className="container-site relative animate-fade-up">
          <OpenNow dark />
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.12] text-white sm:text-[3.4rem]">Book your appointment.</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/75">
            Fill in the form and tap <strong className="text-white">Send on WhatsApp</strong> — your request reaches the clinic with every detail. Or simply call us.
          </p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/70">
            <a href={telHref} className="inline-flex items-center gap-2 hover:text-white"><Phone className="h-4 w-4 text-blush" aria-hidden /> {clinic.phone.display}</a>
            <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4 text-blush" aria-hidden /> {clinic.hours.label}<Verify show={clinic.hours.verifyDays} dark /></span>
            <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-blush" aria-hidden /> Tadepalli, NH 16</span>
          </div>
        </div>
      </section>
      <section className="relative -mt-28 pb-20">
        <div className="container-site">
          <BookingForm />
          <p className="mt-6 text-center text-sm text-muted">{fullAddress}</p>
        </div>
      </section>
    </>
  );
}
