// Booking assistant (the popup): pure rules, unit-tested in tests/assistant.test.ts.
// It asks: what's bothering you → whom to consult (suggested) → when → name + mobile, then opens WhatsApp with the
// same message as the /book form. Nothing is stored; the patient's own WhatsApp sends it.
import { clinic } from '@/content/clinic';
import { concernById } from '@/content/concerns';
import { type AppointmentRequest, NOT_SURE, addDays, clinicToday, emptyRequest } from './appointment';
import { clinicMinutes } from './hours';

/** Auto-open once per browsing session, after AUTO_OPEN_DELAY_MS, never on these paths. */
export const AUTO_OPEN_DELAY_MS = 3000;
export const AUTO_OPEN_EXCLUDED = ['/book', '/privacy'];
export const SESSION_KEY = 'bnf.assistant';
export type SessionState = 'shown' | 'sent' | null;

export function canAutoOpen({ pathname, session, anotherDialogOpen }: { pathname: string; session: SessionState; anotherDialogOpen: boolean }) {
  const p = pathname.split(/[?#]/)[0].replace(/\/+$/, '') || '/';
  if (AUTO_OPEN_EXCLUDED.some((e) => p === e || p.startsWith(`${e}/`))) return false;
  if (session !== null) return false;
  return !anotherDialogOpen;
}

export type WhenChoice = 'today' | 'tomorrow' | 'date';

/** Today is offered only while the clinic is still open for at least another hour. */
export function canBookToday(now = new Date()): boolean {
  const [ch, cm] = clinic.hours.close.split(':').map(Number);
  return clinicMinutes(now) <= ch * 60 + cm - 60;
}

export function resolveDate(when: WhenChoice, picked: string, now = new Date()): string {
  const today = clinicToday(now);
  if (when === 'today') return today;
  if (when === 'tomorrow') return addDays(today, 1);
  return picked;
}

export interface AssistantAnswers {
  concern: string; // concern id
  doctor: string; // doctor slug or NOT_SURE
  when: WhenChoice;
  pickedDate: string;
  time: AppointmentRequest['time'];
  name: string;
  phone: string;
  visit: AppointmentRequest['visit'];
}

export const emptyAnswers = (): AssistantAnswers => ({
  concern: '',
  doctor: NOT_SURE,
  when: 'tomorrow',
  pickedDate: '',
  time: 'any',
  name: '',
  phone: '',
  visit: 'first',
});

/** The doctor the assistant suggests for a concern (NOT_SURE when the clinic should decide). */
export const suggestedDoctor = (concernId: string) => concernById(concernId)?.doctor?.slug ?? NOT_SURE;

/** Answers → the same request the /book form builds (so the WhatsApp message is identical). */
export function toRequest(a: AssistantAnswers, now = new Date()): AppointmentRequest {
  const c = concernById(a.concern);
  return {
    ...emptyRequest(),
    name: a.name,
    phone: a.phone,
    doctor: a.doctor,
    treatment: c?.treatment ?? '',
    date: resolveDate(a.when, a.pickedDate, now),
    time: a.time,
    visit: a.visit,
    notes: c ? `Concern: ${c.label.replace(/[“”]/g, '"')}` : '',
  };
}
