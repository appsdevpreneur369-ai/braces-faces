// Single source of clinic facts. Every value here came from the clinic owner's brief (2 Nov 2026).
// `verify` = given in the brief but flagged there (or conflicting) — shown with a "To confirm" badge on
// non-production builds (NEXT_PUBLIC_SHOW_DRAFT_BADGES=true). Never add facts that were not supplied.

export const clinic = {
  name: 'Braces & Faces Dental Clinic',
  shortName: 'Braces & Faces',
  centre: 'Maxillofacial and Orthodontic Centre',
  tagline: 'Elevate your experience with our expert speciality oriented care! Consult our experienced Doctors!',
  phone: {
    display: '+91 88669 22449',
    e164: '+918866922449',
  },
  // The brief asks for a WhatsApp button; it gives one number. Assumed to be the same number (verify).
  whatsapp: { e164: '918866922449', verify: true },
  address: {
    line1: '2nd Floor, Mourya’s Icon',
    line2: 'Near State Bank, NH 16 Service Road',
    locality: 'Tadepalli',
    city: 'Vijayawada',
    region: 'Andhra Pradesh',
    postalCode: '522501',
    // Google listing says "Akshara Building"; the clinic's details say "Mourya's Icon" (verify).
    verify: true,
  },
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Braces+and+Faces+Dental+%26+Maxillofacial+Clinic+Tadepalle',
  mapsEmbed: 'https://www.google.com/maps?q=Braces+and+Faces+Dental+%26+Maxillofacial+Clinic,+Tadepalle,+Andhra+Pradesh+522501&output=embed',
  // Hours from the brief: "10 am till 8 pm". Weekly days not given — shown without day names (verify Sunday).
  hours: { open: '10:00', close: '20:00', label: '10 AM – 8 PM', verifyDays: true },
  timeZone: 'Asia/Kolkata',
  google: { rating: '5.0', reviewCount: 55, verify: true },
} as const;

export const fullAddress = [
  clinic.address.line1,
  clinic.address.line2,
  `${clinic.address.locality}, ${clinic.address.city}`,
  `${clinic.address.region} ${clinic.address.postalCode}`,
].join(', ');

export const telHref = `tel:${clinic.phone.e164}`;
export const waBase = `https://wa.me/${clinic.whatsapp.e164}`;
