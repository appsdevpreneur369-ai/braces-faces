// "What's bothering you?" — the patient's words mapped to the right specialist and (optionally) a treatment.
// Used by the home concern finder and the booking assistant popup. General guidance only, never a diagnosis.
import { doctors, type Doctor } from './doctors';

const [ortho, maxfax] = doctors;

export interface Concern {
  id: string;
  label: string;
  hint: string;
  doctor: Doctor | null; // null = let the clinic decide
  treatment?: string;
}

export const CONCERNS: Concern[] = [
  { id: 'crooked', label: 'Crooked or gapped teeth', hint: 'Braces or aligners', doctor: ortho, treatment: 'aligners' },
  { id: 'invisible', label: 'I want “invisible” braces', hint: 'Invisalign / clear aligners', doctor: ortho, treatment: 'invisalign' },
  { id: 'thumb', label: 'My child sucks a thumb', hint: 'Habit-breaking therapy', doctor: ortho, treatment: 'habit-breaking' },
  { id: 'grinding', label: 'I grind my teeth at night', hint: 'Bruxism care, night guard', doctor: ortho, treatment: 'bruxism' },
  { id: 'sports', label: 'I play contact sports', hint: 'Custom mouth guard', doctor: ortho, treatment: 'mouth-guards' },
  { id: 'jaw-pain', label: 'Jaw clicks or hurts', hint: 'TMJ assessment', doctor: maxfax, treatment: 'tmj' },
  { id: 'injury', label: 'Injury to the face or jaw', hint: 'Facial trauma care', doctor: maxfax, treatment: 'facial-trauma' },
  { id: 'swelling', label: 'A swelling on my face', hint: 'Swelling evaluation', doctor: maxfax, treatment: 'facial-swellings' },
  { id: 'ulcer', label: 'Ulcer or patch that won’t heal', hint: 'Oral cancer screening', doctor: maxfax, treatment: 'oral-cancer' },
  { id: 'jaw-position', label: 'Upper / lower jaw sticks out', hint: 'Braces + jaw surgery plan', doctor: maxfax, treatment: 'jaw-surgery' },
];

/** Extra choices only offered in the booking assistant. */
export const ASSISTANT_EXTRAS: Concern[] = [
  { id: 'checkup', label: 'A general check-up', hint: 'We’ll suggest the right doctor', doctor: null },
  { id: 'other', label: 'Something else', hint: 'Tell us in a note', doctor: null, treatment: 'other' },
];

export const concernById = (id: string) => [...CONCERNS, ...ASSISTANT_EXTRAS].find((c) => c.id === id);
