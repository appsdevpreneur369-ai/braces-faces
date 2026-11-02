import { clinic, fullAddress } from '@/content/clinic';
import { doctors } from '@/content/doctors';
import { SITE_URL } from './site';

export function clinicJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    name: clinic.name,
    alternateName: `${clinic.shortName} ${clinic.centre}`,
    url: SITE_URL,
    telephone: clinic.phone.e164,
    image: `${SITE_URL}/images/clinic-waiting-room.webp`,
    logo: `${SITE_URL}/images/logo-lockup.webp`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${clinic.address.line1}, ${clinic.address.line2}`,
      addressLocality: clinic.address.locality,
      addressRegion: clinic.address.region,
      postalCode: clinic.address.postalCode,
      addressCountry: 'IN',
    },
    description: `Orthodontics and oral & maxillofacial surgery in Tadepalli, Vijayawada. ${fullAddress}.`,
    medicalSpecialty: ['Orthodontic', 'Surgical'],
    employee: doctors.map((d) => ({ '@type': 'Physician', name: d.name, jobTitle: d.title, url: `${SITE_URL}/doctors/${d.slug}` })),
  };
}
