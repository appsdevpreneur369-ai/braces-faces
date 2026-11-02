import { describe, expect, it } from 'vitest';
import { buildMessage, clinicToday, emptyRequest, normalizeIndianMobile, validate, whatsappHref } from '@/lib/appointment';
import { isOpen } from '@/lib/hours';

// 2 Nov 2026, 11:00 IST
const NOW = new Date('2026-11-02T05:30:00Z');

const filled = () => ({
  ...emptyRequest(),
  name: '  Ravi Kumar ',
  phone: '+91 98480-12345',
  age: '24',
  gender: 'Male',
  doctor: 'dr-bharghav-rayala',
  treatment: 'invisalign',
  date: '2026-11-05',
  time: 'evening',
  notes: 'Gap in\n front teeth',
});

describe('normalizeIndianMobile', () => {
  it.each([
    ['9848012345', '9848012345'],
    ['+91 98480 12345', '9848012345'],
    ['919848012345', '9848012345'],
    ['09848012345', '9848012345'],
  ])('%s -> %s', (raw, want) => expect(normalizeIndianMobile(raw)).toBe(want));
  it.each(['12345', '5848012345', '98480123456', 'abc'])('rejects %s', (raw) => expect(normalizeIndianMobile(raw)).toBeNull());
});

describe('validate', () => {
  it('accepts a complete request', () => expect(validate(filled(), NOW)).toEqual({}));
  it('requires name, phone and date', () => {
    const e = validate(emptyRequest(), NOW);
    expect(Object.keys(e).sort()).toEqual(['date', 'name', 'phone']);
  });
  it('refuses past dates and dates too far ahead (clinic time zone)', () => {
    expect(validate({ ...filled(), date: '2026-11-01' }, NOW).date).toMatch(/passed/);
    expect(validate({ ...filled(), date: '2026-11-02' }, NOW).date).toBeUndefined();
    expect(validate({ ...filled(), date: '2027-03-01' }, NOW).date).toMatch(/90 days/);
  });
  it('uses IST for "today" even when UTC is still yesterday', () => {
    expect(clinicToday(new Date('2026-11-01T20:00:00Z'))).toBe('2026-11-02');
  });
  it('checks age only when given', () => {
    expect(validate({ ...filled(), age: '' }, NOW).age).toBeUndefined();
    expect(validate({ ...filled(), age: '0' }, NOW).age).toBeDefined();
  });
});

describe('buildMessage', () => {
  it('carries every detail the clinic needs', () => {
    const m = buildMessage(filled());
    expect(m).toContain('*Patient:* Ravi Kumar (24 yrs, Male)');
    expect(m).toContain('*Mobile:* +91 98480 12345');
    expect(m).toContain('*Doctor:* Dr. Bharghav Rayala (Orthodontics)');
    expect(m).toContain('*For:* Invisalign');
    expect(m).toContain('*Preferred date:* Thu, 5 Nov 2026');
    expect(m).toContain('*Preferred time:* Evening (4 PM – 8 PM)');
    expect(m).toContain('*Note:* Gap in front teeth');
  });
  it('says "not sure" and consultation when nothing was chosen', () => {
    const m = buildMessage({ ...filled(), doctor: 'not-sure', treatment: '' });
    expect(m).toContain('Not sure — please suggest');
    expect(m).toContain('Consultation / check-up');
  });
  it('builds a wa.me link to the clinic number with the text encoded', () => {
    const href = whatsappHref(filled());
    expect(href.startsWith('https://wa.me/918866922449?text=')).toBe(true);
    expect(decodeURIComponent(href.split('text=')[1])).toBe(buildMessage(filled()));
  });
});

describe('isOpen', () => {
  it('is open 10 AM – 8 PM IST', () => {
    expect(isOpen(new Date('2026-11-02T04:29:00Z'))).toBe(false); // 9:59
    expect(isOpen(new Date('2026-11-02T04:30:00Z'))).toBe(true); // 10:00
    expect(isOpen(new Date('2026-11-02T14:29:00Z'))).toBe(true); // 19:59
    expect(isOpen(new Date('2026-11-02T14:30:00Z'))).toBe(false); // 20:00
  });
});
