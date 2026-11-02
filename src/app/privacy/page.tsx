import type { Metadata } from 'next';
import { PageHeader } from '@/components/sections';
import { clinic } from '@/content/clinic';

export const metadata: Metadata = { title: 'Privacy', description: 'How the Braces & Faces website handles your information.', alternates: { canonical: '/privacy' } };

export default function PrivacyPage() {
  return (
    <>
      <PageHeader eyebrow="Privacy" title="Your details stay between you and the clinic." />
      <section className="py-16">
        <div className="container-site max-w-3xl space-y-6 text-[17px] leading-relaxed text-body">
          <p>
            This website has no accounts, no database and no contact form that saves data. When you use the appointment form, the details you type are turned into a WhatsApp message on your own device. Nothing is sent until you press send inside WhatsApp, and then it goes directly from your WhatsApp to the clinic’s number ({clinic.phone.display}).
          </p>
          <p>
            The clinic uses the details you send only to arrange and confirm your appointment and to contact you about it. To ask for your messages to be deleted, call or WhatsApp the clinic.
          </p>
          <p>
            The map on the contact section is loaded from Google only when you tap “Show map”. Links to Google reviews and directions open Google’s own websites, which have their own privacy policies.
          </p>
          <p>
            Information on this website is general and is not medical advice. Please consult the doctor for advice about your own condition.
          </p>
        </div>
      </section>
    </>
  );
}
