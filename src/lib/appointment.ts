// Appointment request -> WhatsApp message. No server, no database: the patient's own WhatsApp sends the details
// to the clinic number, so nothing is stored on this website. (Custom Starter: website only, no ClinicFlow booking.)
import { clinic, waBase } from '@/content/clinic';
import { doctors } from '@/content/doctors';
import { treatmentById } from '@/content/treatments';

export const NOT_SURE = 'not-sure';

export const TIME_WINDOWS = [
  { id: 'morning', label: 'Morning (10 AM – 12 PM)' },
  { id: 'afternoon', label: 'Afternoon (12 PM – 4 PM)' },
  { id: 'evening', label: 'Evening (4 PM – 8 PM)' },
  { id: 'any', label: 'Any time' },
] as const;

export interface AppointmentRequest {
  name: string;
  phone: string;
  age: string;
  gender: string;
  doctor: string; // doctor slug or NOT_SURE
  treatment: string; // treatment id, '' or 'other'
  date: string; // YYYY-MM-DD
  time: string; // TIME_WINDOWS id
  visit: 'first' | 'follow-up';
  notes: string;
}

export const emptyRequest = (): AppointmentRequest => ({
  name: '',
  phone: '',
  age: '',
  gender: '',
  doctor: NOT_SURE,
  treatment: '',
  date: '',
  time: 'any',
  visit: 'first',
  notes: '',
});

/** Indian mobile: 10 digits starting 6-9, optional +91 / 91 / 0 prefix, spaces and dashes allowed. */
export function normalizeIndianMobile(raw: string): string | null {
  const digits = raw.replace(/[\s\-()]/g, '').replace(/^\+?91(?=\d{10}$)/, '').replace(/^0(?=\d{10}$)/, '');
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
}

export const MAX_DAYS_AHEAD = 90;

/** Today's date in the clinic's time zone as YYYY-MM-DD. */
export function clinicToday(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: clinic.timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}

export function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export type Errors = Partial<Record<keyof AppointmentRequest, string>>;

export function validate(r: AppointmentRequest, now = new Date()): Errors {
  const e: Errors = {};
  const name = r.name.trim();
  if (name.length < 2) e.name = 'Please enter the patient’s name.';
  else if (name.length > 60) e.name = 'Please keep the name under 60 characters.';
  if (!normalizeIndianMobile(r.phone)) e.phone = 'Enter a 10-digit Indian mobile number.';
  if (r.age.trim()) {
    const n = Number(r.age);
    if (!Number.isInteger(n) || n < 1 || n > 110) e.age = 'Enter age in years (1–110).';
  }
  if (!r.date) e.date = 'Pick a preferred date.';
  else {
    const today = clinicToday(now);
    if (r.date < today) e.date = 'That date has passed — pick today or later.';
    else if (r.date > addDays(today, MAX_DAYS_AHEAD)) e.date = `Pick a date within the next ${MAX_DAYS_AHEAD} days.`;
  }
  if (r.notes.length > 400) e.notes = 'Please keep the note under 400 characters.';
  return e;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "Thu, 5 Nov 2026" — built by hand so it reads the same on every browser/ICU version. */
export function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return `${DAYS[d.getUTCDay()]}, ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** "Thu 5" for the quick-date chips. */
export function shortDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return `${DAYS[d.getUTCDay()]} ${d.getUTCDate()}`;
}

export function describeDoctor(slug: string): string {
  const d = doctors.find((x) => x.slug === slug);
  return d ? `${d.name} (${d.specialityLabel})` : 'Not sure — please suggest';
}

export function describeTreatment(id: string): string {
  if (!id) return 'Consultation / check-up';
  if (id === 'other') return 'Other (see note)';
  return treatmentById(id)?.name ?? 'Consultation / check-up';
}

/** The text that lands in the clinic's WhatsApp. Plain lines, readable on any phone. */
export function buildMessage(r: AppointmentRequest): string {
  const mobile = normalizeIndianMobile(r.phone) ?? r.phone.trim();
  const who = [r.age.trim() ? `${r.age.trim()} yrs` : '', r.gender].filter(Boolean).join(', ');
  const timeLabel = TIME_WINDOWS.find((t) => t.id === r.time)?.label ?? 'Any time';
  const lines = [
    `*New appointment request — ${clinic.shortName}*`,
    '',
    `*Patient:* ${r.name.trim()}${who ? ` (${who})` : ''}`,
    `*Mobile:* +91 ${mobile.slice(0, 5)} ${mobile.slice(5)}`,
    `*Doctor:* ${describeDoctor(r.doctor)}`,
    `*For:* ${describeTreatment(r.treatment)}`,
    `*Preferred date:* ${r.date ? formatDate(r.date) : '—'}`,
    `*Preferred time:* ${timeLabel}`,
    `*Visit:* ${r.visit === 'follow-up' ? 'Follow-up' : 'First visit'}`,
  ];
  if (r.notes.trim()) lines.push(`*Note:* ${r.notes.trim().replace(/\s+/g, ' ')}`);
  lines.push('', 'Sent from the clinic website. Please confirm the slot.');
  return lines.join('\n');
}

export function whatsappHref(r: AppointmentRequest): string {
  return `${waBase}?text=${encodeURIComponent(buildMessage(r))}`;
}

export const generalWhatsappHref = `${waBase}?text=${encodeURIComponent(`Hello ${clinic.shortName}, I would like to book an appointment.`)}`;
