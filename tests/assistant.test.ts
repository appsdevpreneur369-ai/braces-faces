import { describe, expect, it } from 'vitest';
import { CONCERNS, concernById } from '@/content/concerns';
import { NOT_SURE, buildMessage, validate } from '@/lib/appointment';
import { canAutoOpen, canBookToday, emptyAnswers, resolveDate, suggestedDoctor, toRequest } from '@/lib/assistant';

// 2 Nov 2026, 11:00 IST
const NOW = new Date('2026-11-02T05:30:00Z');

describe('canAutoOpen', () => {
  const base = { pathname: '/', session: null, anotherDialogOpen: false } as const;
  it('opens on a fresh session on content pages', () => {
    expect(canAutoOpen(base)).toBe(true);
    expect(canAutoOpen({ ...base, pathname: '/treatments' })).toBe(true);
  });
  it('never on the booking or privacy pages', () => {
    expect(canAutoOpen({ ...base, pathname: '/book' })).toBe(false);
    expect(canAutoOpen({ ...base, pathname: '/book/' })).toBe(false);
    expect(canAutoOpen({ ...base, pathname: '/privacy' })).toBe(false);
  });
  it('only once per session, and not over another dialog', () => {
    expect(canAutoOpen({ ...base, session: 'shown' })).toBe(false);
    expect(canAutoOpen({ ...base, session: 'sent' })).toBe(false);
    expect(canAutoOpen({ ...base, anotherDialogOpen: true })).toBe(false);
  });
});

describe('dates', () => {
  it('today/tomorrow/picked in clinic time', () => {
    expect(resolveDate('today', '', NOW)).toBe('2026-11-02');
    expect(resolveDate('tomorrow', '', NOW)).toBe('2026-11-03');
    expect(resolveDate('date', '2026-11-20', NOW)).toBe('2026-11-20');
  });
  it('rolls over at IST midnight, not UTC', () => {
    // 2 Nov 2026 19:00 UTC = 3 Nov 00:30 IST
    expect(resolveDate('today', '', new Date('2026-11-02T19:00:00Z'))).toBe('2026-11-03');
  });
  it('offers today only until an hour before closing (8 PM)', () => {
    expect(canBookToday(NOW)).toBe(true);
    expect(canBookToday(new Date('2026-11-02T13:30:00Z'))).toBe(true); // 7:00 PM IST
    expect(canBookToday(new Date('2026-11-02T13:31:00Z'))).toBe(false); // 7:01 PM IST
  });
});

describe('suggestions', () => {
  it('maps every concern to its specialist', () => {
    for (const c of CONCERNS) expect(suggestedDoctor(c.id)).toBe(c.doctor?.slug);
    expect(suggestedDoctor('crooked')).toBe('dr-bharghav-rayala');
    expect(suggestedDoctor('jaw-pain')).toBe('dr-sai-meghana-yarlagadda');
    expect(suggestedDoctor('checkup')).toBe(NOT_SURE);
    expect(concernById('nope')).toBeUndefined();
  });
});

describe('toRequest → WhatsApp message', () => {
  const answers = { ...emptyAnswers(), concern: 'invisible', doctor: 'dr-bharghav-rayala', when: 'tomorrow' as const, time: 'evening' as const, name: 'Ravi Kumar', phone: '98480 12345' };
  it('builds the same request the /book form sends', () => {
    const r = toRequest(answers, NOW);
    expect(r).toMatchObject({ doctor: 'dr-bharghav-rayala', treatment: 'invisalign', date: '2026-11-03', time: 'evening', visit: 'first' });
    expect(validate(r, NOW)).toEqual({});
    const msg = buildMessage(r);
    expect(msg).toContain('*Doctor:* Dr. Bharghav Rayala (Orthodontics)');
    expect(msg).toContain('*For:* Invisalign');
    expect(msg).toContain('*Preferred date:* Tue, 3 Nov 2026');
    expect(msg).toContain('*Note:* Concern: I want "invisible" braces');
  });
  it('flags missing name, bad mobile and a missing picked date', () => {
    const e = validate(toRequest({ ...emptyAnswers(), when: 'date', phone: '12345' }, NOW), NOW);
    expect(Object.keys(e).sort()).toEqual(['date', 'name', 'phone']);
  });
  it('"something else" asks for a note, not a treatment', () => {
    expect(toRequest({ ...answers, concern: 'other' }, NOW).treatment).toBe('other');
  });
});
