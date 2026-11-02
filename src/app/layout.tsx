import type { Metadata, Viewport } from 'next';
import { Nunito_Sans, Sora } from 'next/font/google';
import type { ReactNode } from 'react';
import { AssistantProvider } from '@/components/assistant/AssistantProvider';
import { RevealObserver } from '@/components/client';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { MobileActionBar } from '@/components/MobileActionBar';
import { clinic } from '@/content/clinic';
import { clinicJsonLd } from '@/lib/seo';
import { NOINDEX, SITE_URL } from '@/lib/site';
import './globals.css';

// Same type pairing as the Aishwarya clinic site (owner, 2 Nov 2026): Sora headings + wordmark, Nunito Sans body.
// Both variable fonts, self-hosted by next/font (no Google request at runtime), swap + metric-matched fallbacks.
const heading = Sora({ subsets: ['latin'], weight: 'variable', variable: '--font-heading', display: 'swap' });
const body = Nunito_Sans({ subsets: ['latin'], weight: 'variable', variable: '--font-body', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Braces & Faces Dental Clinic | Orthodontist & Maxillofacial Surgeon, Tadepalli', template: '%s | Braces & Faces, Tadepalli' },
  description:
    'Braces, Invisalign, clear aligners, jaw surgery, TMJ and facial trauma care at Braces & Faces — a Maxillofacial & Orthodontic Centre on NH 16, Tadepalli, Vijayawada. Book on WhatsApp or call +91 88669 22449.',
  applicationName: clinic.name,
  alternates: { canonical: '/' },
  robots: NOINDEX ? { index: false, follow: false } : { index: true, follow: true },
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: { type: 'website', siteName: clinic.name, locale: 'en_IN', images: [{ url: '/images/clinic-waiting-room.webp', width: 680, height: 453 }] },
};

export const viewport: Viewport = { themeColor: '#13163A', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-IN" className={`${heading.variable} ${body.variable}`}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-white focus:px-5 focus:py-3 focus:font-semibold focus:text-ink focus:shadow-lift">
          Skip to content
        </a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(clinicJsonLd()) }} />
        <AssistantProvider>
          <Header />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <MobileActionBar />
        </AssistantProvider>
        <RevealObserver />
      </body>
    </html>
  );
}
