import type { Speciality } from './doctors';

export interface Treatment {
  id: string;
  name: string;
  speciality: Speciality;
  blurb: string;
  verify?: boolean;
  /** Procedures that may be done in a hospital setting — shown with a note instead of a promise. */
  hospital?: boolean;
}

// From the doctors' banners (2 Nov 2026). Which procedures are done in-clinic vs by referral is still to be confirmed.
export const treatments: Treatment[] = [
  // Orthodontics — Dr. Bharghav Rayala
  { id: 'invisalign', name: 'Invisalign', speciality: 'orthodontics', blurb: 'Clear, removable trays that move teeth in planned steps — hardly noticeable at work or school.', verify: true },
  { id: 'aligners', name: 'Clear aligners', speciality: 'orthodontics', blurb: 'Custom-made transparent aligners for mild to moderate crowding and spacing.' },
  { id: 'pitts-braces', name: 'Pitts braces', speciality: 'orthodontics', blurb: 'A specialised fixed-brace system designed around a broad, balanced smile.', verify: true },
  { id: 'self-ligating', name: 'Self-ligating braces', speciality: 'orthodontics', blurb: 'Brackets with built-in clips instead of elastic ties — easier to clean, fewer adjustments.' },
  { id: 'myofunctional', name: 'Myofunctional appliances', speciality: 'orthodontics', blurb: 'Removable appliances that train the muscles and guide a child’s growing jaws.' },
  { id: 'habit-breaking', name: 'Habit-breaking therapy', speciality: 'orthodontics', blurb: 'Gentle help to stop thumb sucking, tongue thrusting and mouth breathing that shape teeth.' },
  { id: 'bruxism', name: 'Bruxism treatment', speciality: 'orthodontics', blurb: 'Finding out why you grind or clench, and protecting teeth and jaw joints from the wear.' },
  { id: 'night-guards', name: 'Night guards', speciality: 'orthodontics', blurb: 'Thin, custom-fitted guards that take the force of night-time grinding.' },
  { id: 'mouth-guards', name: 'Mouth guards', speciality: 'orthodontics', blurb: 'Protective guards moulded to your teeth — far better fit than shop-bought ones.' },
  { id: 'sports-dentistry', name: 'Sports dentistry', speciality: 'orthodontics', blurb: 'Protection plans for players and prompt care when a game ends with a dental knock.' },
  // Oral & maxillofacial surgery — Dr. Sai Meghana Yarlagadda
  { id: 'facial-trauma', name: 'Facial trauma', speciality: 'maxillofacial', blurb: 'Assessment and repair of injuries to the facial bones, jaws and soft tissues.' },
  { id: 'sports-injuries', name: 'Sports injuries', speciality: 'maxillofacial', blurb: 'Treatment of face and mouth injuries from cricket, kabaddi, cycling and more.' },
  { id: 'jaw-surgery', name: 'Corrective jaw surgery', speciality: 'maxillofacial', blurb: 'Repositioning the jaws to fix skeletal bite problems, often planned alongside braces.', hospital: true },
  { id: 'facial-swellings', name: 'Facial swellings', speciality: 'maxillofacial', blurb: 'Finding the cause of a swelling — infection, cyst or growth — and treating it.' },
  { id: 'facial-pathologies', name: 'Facial pathologies', speciality: 'maxillofacial', blurb: 'Diagnosis and surgical management of cysts, lesions and diseases of the facial structures.' },
  { id: 'tmj', name: 'TM joint disorders', speciality: 'maxillofacial', blurb: 'Relief for jaw-joint pain, clicking, locking and difficulty opening the mouth.' },
  { id: 'sleep-apnea', name: 'Obstructive sleep apnoea', speciality: 'maxillofacial', blurb: 'Evaluation of jaw-related causes of snoring and sleep apnoea, with surgical options for selected patients.', hospital: true },
  { id: 'salivary', name: 'Salivary gland diseases', speciality: 'maxillofacial', blurb: 'Care for salivary stones, blockages and swellings of the salivary glands.' },
  { id: 'cleft', name: 'Cleft lip & palate', speciality: 'maxillofacial', blurb: 'Surgical repair and follow-up reconstruction for cleft lip and palate.', hospital: true },
  { id: 'oral-cancer', name: 'Oral & facial cancer', speciality: 'maxillofacial', blurb: 'Early evaluation of suspicious patches or ulcers, and surgical treatment when needed.', hospital: true },
  { id: 'rhinoplasty', name: 'Rhinoplasty', speciality: 'maxillofacial', blurb: 'Reshaping the nose for function, balance or both.', hospital: true },
  { id: 'facial-plastics', name: 'Facial plastic surgery', speciality: 'maxillofacial', blurb: 'Aesthetic and reconstructive procedures for facial harmony.', hospital: true },
  { id: 'hair-transplant', name: 'Hair transplantation', speciality: 'maxillofacial', blurb: 'Hair restoration procedures, planned after a detailed consultation.' },
];

export const specialityMeta: Record<Speciality, { label: string; doctorSlug: string; strap: string }> = {
  orthodontics: {
    label: 'Orthodontics',
    doctorSlug: 'dr-bharghav-rayala',
    strap: 'Straighter teeth, a comfortable bite and a smile you want to show.',
  },
  maxillofacial: {
    label: 'Oral & Maxillofacial Surgery',
    doctorSlug: 'dr-sai-meghana-yarlagadda',
    strap: 'Expert surgical care for injuries and conditions of the face, jaws and mouth.',
  },
};

export const treatmentById = (id: string) => treatments.find((t) => t.id === id);
