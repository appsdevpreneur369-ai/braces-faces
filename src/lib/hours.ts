import { clinic } from '@/content/clinic';

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

/** Minutes since midnight in the clinic's time zone. */
export function clinicMinutes(now = new Date()): number {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: clinic.timeZone, hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(now);
  const h = Number(parts.find((p) => p.type === 'hour')?.value ?? 0) % 24;
  const m = Number(parts.find((p) => p.type === 'minute')?.value ?? 0);
  return h * 60 + m;
}

export function isOpen(now = new Date()): boolean {
  const t = clinicMinutes(now);
  return t >= toMinutes(clinic.hours.open) && t < toMinutes(clinic.hours.close);
}
