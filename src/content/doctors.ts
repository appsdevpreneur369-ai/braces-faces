// The two consultants, from the clinic's banners (2 Nov 2026). Copy is written for this site.
// `verify` items were flagged in the brief: confirm with the clinic before production.

export type Speciality = 'orthodontics' | 'maxillofacial';

export interface Doctor {
  slug: string;
  name: string;
  title: string;
  qualifications: string;
  speciality: Speciality;
  specialityLabel: string;
  headline: string;
  summary: string;
  image: 'dr-bharghav-rayala' | 'dr-sai-meghana-yarlagadda';
  badges: { label: string; verify?: boolean }[];
  focus: { title: string; points: string[] }[];
  knownFor: string[];
}

export const doctors: Doctor[] = [
  {
    slug: 'dr-bharghav-rayala',
    name: 'Dr. Bharghav Rayala',
    title: 'Consultant Orthodontist & Dentofacial Orthopaedist',
    qualifications: 'MDS — Orthodontics & Dentofacial Orthopaedics',
    speciality: 'orthodontics',
    specialityLabel: 'Orthodontics',
    headline: 'Confident smiles, built tooth by tooth.',
    summary:
      'Dr. Bharghav plans every smile around the bite underneath it. Whether you want near-invisible aligners, braces that need fewer adjustments, or early guidance for a growing child’s jaw, he maps the movement first and shows you the route before treatment begins.',
    image: 'dr-bharghav-rayala',
    badges: [{ label: 'MDS' }, { label: 'Invisalign provider', verify: true }],
    focus: [
      {
        title: 'Smile alignment',
        points: ['Invisalign and other clear aligners', 'Pitts and self-ligating braces', 'Crowded, gapped or rotated teeth'],
      },
      {
        title: 'Growing jaws',
        points: ['Myofunctional appliances', 'Dentofacial orthopaedic guidance', 'Habit-breaking therapy (thumb sucking, tongue thrust)'],
      },
      {
        title: 'Grinding & clenching',
        points: ['Bruxism assessment', 'Custom night guards', 'Jaw-friendly bite planning'],
      },
      {
        title: 'Sports dentistry',
        points: ['Custom-fitted mouth guards', 'Protection plans for athletes', 'Advice after a sports knock'],
      },
    ],
    knownFor: ['Braces', 'Invisalign', 'Clear aligners', 'Bite correction', 'Night guards'],
  },
  {
    slug: 'dr-sai-meghana-yarlagadda',
    name: 'Dr. Sai Meghana Yarlagadda',
    title: 'Consultant Oral & Maxillofacial Surgeon',
    qualifications: 'MDS — Oral & Maxillofacial Surgery, Dip. OGS',
    speciality: 'maxillofacial',
    specialityLabel: 'Maxillofacial Surgery',
    headline: 'Surgical care for the face, jaws and mouth.',
    summary:
      'Dr. Sai Meghana looks after the structures that hold a smile together — the jawbones, the joints that move them and the soft tissues around them. From a facial injury on the sports field to a long-standing jaw problem, she explains the diagnosis plainly and walks you through every surgical option, including when surgery is not needed.',
    image: 'dr-sai-meghana-yarlagadda',
    badges: [{ label: 'MDS' }, { label: 'Dip. OGS', verify: true }],
    focus: [
      {
        title: 'Trauma & reconstruction',
        points: ['Facial injuries and fractures', 'Sports-related facial injuries', 'Reconstruction where needed'],
      },
      {
        title: 'Jaw surgery & TMJ',
        points: ['Corrective jaw (orthognathic) surgery', 'Jaw joint pain and clicking', 'Limited mouth opening'],
      },
      {
        title: 'Swellings & pathology',
        points: ['Facial swellings', 'Salivary gland conditions', 'Oral and facial cancer evaluation and surgery'],
      },
      {
        title: 'Congenital & aesthetic',
        points: ['Cleft lip and palate', 'Obstructive sleep apnoea (selected patients)', 'Rhinoplasty, facial plastic surgery, hair transplantation'],
      },
    ],
    knownFor: ['Facial trauma', 'Jaw surgery', 'TMJ disorders', 'Cleft lip & palate', 'Facial swellings'],
  },
];

export const doctorBySlug = (slug: string) => doctors.find((d) => d.slug === slug);
