'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, CalendarDays, Check, CheckCircle2, Copy, Phone, Sparkles, X } from 'lucide-react';
import { clinic, telHref } from '@/content/clinic';
import { ASSISTANT_EXTRAS, CONCERNS, concernById } from '@/content/concerns';
import { doctors } from '@/content/doctors';
import { MAX_DAYS_AHEAD, NOT_SURE, TIME_WINDOWS, addDays, buildMessage, clinicToday, formatDate, validate, whatsappHref } from '@/lib/appointment';
import { type AssistantAnswers, canBookToday, emptyAnswers, resolveDate, suggestedDoctor, toRequest } from '@/lib/assistant';
import { cn } from '@/lib/cn';
import { Photo, WhatsAppIcon } from '../ui';
import type { AssistantPrefill } from './AssistantProvider';

const STEPS = ['Concern', 'Doctor', 'When', 'Your details'] as const;

/** Accessible dialog: focus trapped, Esc / backdrop close, scroll locked; bottom sheet on phones. */
export function AssistantDialog({ auto, prefill, onClose }: { auto: boolean; prefill: AssistantPrefill; onClose: (sent: boolean) => void }) {
  const uid = useId();
  const ref = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [a, setA] = useState<AssistantAnswers>(() => {
    const base = emptyAnswers();
    if (prefill.concern) return { ...base, concern: prefill.concern, doctor: suggestedDoctor(prefill.concern) };
    if (prefill.doctor && doctors.some((d) => d.slug === prefill.doctor)) return { ...base, doctor: prefill.doctor };
    return base;
  });
  const [step, setStep] = useState(prefill.concern ? 1 : 0);
  const [tried, setTried] = useState(false);
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [now] = useState(() => new Date());
  const today = clinicToday(now);
  const todayOk = canBookToday(now);

  const req = useMemo(() => toRequest(a, now), [a, now]);
  const errors = useMemo(() => validate(req, now), [req, now]);
  const set = <K extends keyof AssistantAnswers>(k: K, v: AssistantAnswers[K]) => setA((s) => ({ ...s, [k]: v }));

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    ref.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose(sent);
      if (e.key !== 'Tab' || !ref.current) return;
      const f = Array.from(ref.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])')).filter((el) => el.offsetParent !== null);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) {
        e.preventDefault();
        f[f.length - 1].focus();
      } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) {
        e.preventDefault();
        f[0].focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose, sent]);

  // New step: back to the top of the scroll area, focus its heading for screen readers.
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 });
    bodyRef.current?.querySelector<HTMLElement>('h3')?.focus();
  }, [step, sent]);

  const pickConcern = (id: string) => {
    setA((s) => ({ ...s, concern: id, doctor: suggestedDoctor(id) }));
    setStep(1);
  };

  const whenValid = !(a.when === 'date' && (!a.pickedDate || errors.date));
  const next = () => {
    if (step === 2 && !whenValid) return setTried(true);
    setTried(false);
    setStep((s) => Math.min(3, s + 1));
  };

  const send = () => {
    setTried(true);
    if (errors.name || errors.phone || errors.date) return;
    window.open(whatsappHref(req), '_blank', 'noopener,noreferrer');
    setSent(true);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(buildMessage(req));
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const concern = concernById(a.concern);
  const suggestion = doctors.find((d) => d.slug === suggestedDoctor(a.concern));
  const date = resolveDate(a.when, a.pickedDate, now);

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center md:items-center md:p-6">
      <div className="absolute inset-0 bg-ink-deep/70 backdrop-blur-sm motion-safe:animate-[fade-in_.2s_ease-out]" onClick={() => onClose(sent)} aria-hidden="true" />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${uid}-title`}
        className="relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-[1.75rem] bg-paper shadow-lift motion-safe:animate-sheet-up md:max-h-[88vh] md:max-w-2xl md:rounded-[1.75rem] md:motion-safe:animate-pop-in"
      >
        {/* Header */}
        <div className="relative overflow-hidden bg-ink-deep px-5 pb-5 pt-4 text-white sm:px-7">
          <div aria-hidden className="absolute -right-10 -top-16 h-44 w-44 rounded-full bg-blush/30 blur-3xl" />
          <div aria-hidden className="absolute -left-10 top-6 h-32 w-32 rounded-full bg-mint/20 blur-3xl" />
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-blush">
                <Sparkles className="h-3.5 w-3.5" aria-hidden /> {auto ? 'Quick help · 30 seconds' : 'Book in 30 seconds'}
              </p>
              <h2 id={`${uid}-title`} className="mt-1.5 text-xl font-semibold text-white sm:text-2xl">
                {sent ? 'Almost done — press send in WhatsApp' : 'Let’s find the right specialist for you'}
              </h2>
            </div>
            <button type="button" onClick={() => onClose(sent)} aria-label="Close" data-autofocus className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20">
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>
          {!sent && (
            <ol className="relative mt-4 grid grid-cols-4 gap-2" aria-label={`Step ${step + 1} of ${STEPS.length}`}>
              {STEPS.map((s, i) => (
                <li key={s}>
                  <span className={cn('block h-1.5 rounded-full transition-colors duration-300', i <= step ? 'bg-blush' : 'bg-white/15')} />
                  <span className={cn('mt-1.5 hidden text-[11px] font-semibold sm:block', i === step ? 'text-white' : 'text-white/50')}>{s}</span>
                </li>
              ))}
            </ol>
          )}
        </div>

        {/* Body */}
        <div ref={bodyRef} className="flex-1 overflow-y-auto px-5 py-6 sm:px-7">
          {sent ? (
            <div className="text-center">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-wa/15 text-wa-deep">
                <CheckCircle2 className="h-9 w-9" aria-hidden />
              </span>
              <h3 tabIndex={-1} className="mt-4 text-xl font-semibold outline-none">WhatsApp has opened with your request</h3>
              <p className="mx-auto mt-2 max-w-md text-muted">
                Press <strong className="text-ink">send</strong> in WhatsApp. The clinic replies to confirm your slot — your request isn’t booked until they do.
              </p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <button type="button" onClick={copy} className="btn-ghost">
                  <Copy className="h-4 w-4" aria-hidden /> {copied ? 'Copied' : 'Copy message'}
                </button>
                <a href={telHref} className="btn-ink">
                  <Phone className="h-4 w-4" aria-hidden /> Or call {clinic.phone.display}
                </a>
              </div>
            </div>
          ) : step === 0 ? (
            <section>
              <h3 tabIndex={-1} className="text-lg font-semibold outline-none">What’s bothering you?</h3>
              <p className="mt-1 text-sm text-muted">Pick the closest one — we’ll suggest the right doctor.</p>
              <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                {[...CONCERNS, ...ASSISTANT_EXTRAS].map((c) => {
                  const isOrtho = c.doctor?.speciality === 'orthodontics';
                  const selected = a.concern === c.id;
                  return (
                    <li key={c.id}>
                      <button
                        type="button"
                        onClick={() => pickConcern(c.id)}
                        aria-pressed={selected}
                        className={cn(
                          'group flex min-h-[64px] w-full items-center gap-3 rounded-2xl border bg-white px-4 py-3 text-left transition hover:-translate-y-0.5 hover:shadow-soft',
                          selected ? 'border-ink ring-2 ring-ink' : 'border-line hover:border-ink/40',
                        )}
                      >
                        <span aria-hidden className={cn('h-2.5 w-2.5 shrink-0 rounded-full', !c.doctor ? 'bg-lavender' : isOrtho ? 'bg-blush' : 'bg-teal/60')} />
                        <span className="min-w-0 flex-1">
                          <span className="block font-semibold leading-snug text-ink">{c.label}</span>
                          <span className="block text-xs text-muted">{c.hint}</span>
                        </span>
                        <ArrowRight className="h-4 w-4 shrink-0 text-ink/30 transition group-hover:translate-x-0.5 group-hover:text-ink" aria-hidden />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : step === 1 ? (
            <section>
              <h3 tabIndex={-1} className="text-lg font-semibold outline-none">Whom would you like to consult?</h3>
              {concern && (
                <p className="mt-1 text-sm text-muted">
                  For “{concern.label}”{suggestion ? <> we suggest <strong className="text-ink">{suggestion.name}</strong>.</> : ' the clinic will suggest the right doctor.'}
                </p>
              )}
              <ul className="mt-5 grid gap-3">
                {doctors.map((d) => {
                  const selected = a.doctor === d.slug;
                  const isOrtho = d.speciality === 'orthodontics';
                  return (
                    <li key={d.slug}>
                      <button
                        type="button"
                        onClick={() => set('doctor', d.slug)}
                        aria-pressed={selected}
                        className={cn('flex w-full items-center gap-4 rounded-2xl border bg-white p-3 pr-4 text-left transition', selected ? 'border-ink ring-2 ring-ink' : 'border-line hover:border-ink/40')}
                      >
                        <Photo name={d.image} alt="" sizes="64px" className={cn('h-16 w-16 shrink-0 rounded-xl object-cover object-top', isOrtho ? 'bg-blush' : 'bg-mint')} />
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-ink">{d.name}</span>
                            {suggestion?.slug === d.slug && (
                              <span className="rounded-full bg-wa/15 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-wa-deep">Suggested</span>
                            )}
                          </span>
                          <span className={cn('block text-sm font-semibold', isOrtho ? 'text-rose' : 'text-teal')}>{d.specialityLabel}</span>
                          <span className="block text-xs text-muted">{d.qualifications}</span>
                        </span>
                        <Radio on={selected} />
                      </button>
                    </li>
                  );
                })}
                <li>
                  <button
                    type="button"
                    onClick={() => set('doctor', NOT_SURE)}
                    aria-pressed={a.doctor === NOT_SURE}
                    className={cn('flex min-h-[64px] w-full items-center gap-4 rounded-2xl border bg-white px-4 text-left transition', a.doctor === NOT_SURE ? 'border-ink ring-2 ring-ink' : 'border-line hover:border-ink/40')}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-ink">Not sure — help me decide</span>
                      <span className="block text-xs text-muted">The clinic will match you with the right specialist.</span>
                    </span>
                    <Radio on={a.doctor === NOT_SURE} />
                  </button>
                </li>
              </ul>
            </section>
          ) : step === 2 ? (
            <section>
              <h3 tabIndex={-1} className="text-lg font-semibold outline-none">When would you like to come in?</h3>
              <p className="mt-1 text-sm text-muted">Clinic hours {clinic.hours.label}. The clinic confirms the exact time.</p>
              <div className="mt-5 grid grid-cols-3 gap-2.5" role="radiogroup" aria-label="Preferred day">
                {(
                  [
                    { id: 'today', label: 'Today', sub: todayOk ? formatDate(today).slice(0, 10) : 'Closed for today', disabled: !todayOk },
                    { id: 'tomorrow', label: 'Tomorrow', sub: formatDate(addDays(today, 1)).slice(0, 10), disabled: false },
                    { id: 'date', label: 'Pick a date', sub: a.when === 'date' && a.pickedDate ? formatDate(a.pickedDate).slice(0, 10) : 'Up to 90 days', disabled: false },
                  ] as const
                ).map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    role="radio"
                    aria-checked={a.when === o.id}
                    disabled={o.disabled}
                    onClick={() => set('when', o.id)}
                    className={cn(
                      'flex min-h-[72px] flex-col items-center justify-center rounded-2xl border px-2 py-3 text-center transition disabled:cursor-not-allowed disabled:opacity-50',
                      a.when === o.id ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink hover:border-ink/40',
                    )}
                  >
                    <span className="font-semibold">{o.label}</span>
                    <span className={cn('mt-0.5 text-xs', a.when === o.id ? 'text-white/75' : 'text-muted')}>{o.sub}</span>
                  </button>
                ))}
              </div>
              {a.when === 'date' && (
                <label className="mt-4 block">
                  <span className="label flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-rose" aria-hidden /> Preferred date
                  </span>
                  <input
                    type="date"
                    className="field"
                    min={today}
                    max={addDays(today, MAX_DAYS_AHEAD)}
                    value={a.pickedDate}
                    onChange={(e) => set('pickedDate', e.target.value)}
                    aria-invalid={tried && !whenValid}
                    aria-describedby={tried && !whenValid ? `${uid}-date-err` : undefined}
                  />
                  {tried && !whenValid && (
                    <span id={`${uid}-date-err`} className="mt-1.5 block text-sm font-semibold text-rose">
                      {errors.date ?? 'Pick a preferred date.'}
                    </span>
                  )}
                </label>
              )}
              <p className="mt-6 text-sm font-semibold text-ink">Preferred time</p>
              <div className="mt-2 grid grid-cols-2 gap-2.5" role="radiogroup" aria-label="Preferred time">
                {TIME_WINDOWS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    role="radio"
                    aria-checked={a.time === t.id}
                    onClick={() => set('time', t.id)}
                    className={cn('flex min-h-[56px] flex-col items-center justify-center rounded-xl border px-3 py-2 transition', a.time === t.id ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink hover:border-ink/40')}
                  >
                    <span className="text-sm font-semibold">{t.label.split(' (')[0]}</span>
                    {t.label.includes('(') && (
                      <span className={cn('text-xs', a.time === t.id ? 'text-white/75' : 'text-muted')}>{t.label.split(' (')[1].replace(')', '')}</span>
                    )}
                  </button>
                ))}
              </div>
            </section>
          ) : (
            <section>
              <h3 tabIndex={-1} className="text-lg font-semibold outline-none">Who should we expect?</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="label">Patient’s name</span>
                  <input className="field" autoComplete="name" value={a.name} onChange={(e) => set('name', e.target.value)} aria-invalid={tried && !!errors.name} aria-describedby={tried && errors.name ? `${uid}-name-err` : undefined} />
                  {tried && errors.name && <span id={`${uid}-name-err`} className="mt-1.5 block text-sm font-semibold text-rose">{errors.name}</span>}
                </label>
                <label className="block">
                  <span className="label">Mobile number</span>
                  <span className="relative block">
                    <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[15px] font-semibold text-muted">+91</span>
                    <input className="field pl-12" type="tel" inputMode="numeric" autoComplete="tel-national" value={a.phone} onChange={(e) => set('phone', e.target.value)} aria-invalid={tried && !!errors.phone} aria-describedby={tried && errors.phone ? `${uid}-phone-err` : undefined} />
                  </span>
                  {tried && errors.phone && <span id={`${uid}-phone-err`} className="mt-1.5 block text-sm font-semibold text-rose">{errors.phone}</span>}
                </label>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2.5" role="radiogroup" aria-label="Visit type">
                {(
                  [
                    { id: 'first', label: 'First visit' },
                    { id: 'follow-up', label: 'Follow-up' },
                  ] as const
                ).map((v) => (
                  <button key={v.id} type="button" role="radio" aria-checked={a.visit === v.id} onClick={() => set('visit', v.id)} className={cn('min-h-[48px] rounded-xl border px-3 text-sm font-semibold transition', a.visit === v.id ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink hover:border-ink/40')}>
                    {v.label}
                  </button>
                ))}
              </div>
              <dl className="mt-6 grid gap-2 rounded-2xl bg-lavender-soft p-4 text-sm">
                <Row k="Concern" v={concern?.label ?? '—'} onEdit={() => setStep(0)} />
                <Row k="Doctor" v={doctors.find((d) => d.slug === a.doctor)?.name ?? 'Clinic will suggest'} onEdit={() => setStep(1)} />
                <Row k="When" v={`${date ? formatDate(date) : '—'} · ${TIME_WINDOWS.find((t) => t.id === a.time)?.label ?? ''}`} onEdit={() => setStep(2)} />
              </dl>
              <p className="mt-3 text-xs text-muted">Nothing is stored on this website — your details go only into the WhatsApp message you send.</p>
            </section>
          )}
        </div>

        {/* Footer actions */}
        {!sent && (
          <div className="flex items-center justify-between gap-3 border-t border-line bg-white px-5 py-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] sm:px-7">
            {step > 0 ? (
              <button type="button" onClick={() => setStep((s) => s - 1)} className="inline-flex min-h-[48px] items-center gap-2 rounded-full px-3 font-semibold text-ink hover:bg-ink/5">
                <ArrowLeft className="h-4 w-4" aria-hidden /> Back
              </button>
            ) : (
              <a href={telHref} className="inline-flex min-h-[48px] items-center gap-2 rounded-full px-3 text-sm font-semibold text-ink hover:bg-ink/5">
                <Phone className="h-4 w-4 text-rose" aria-hidden /> Rather call?
              </a>
            )}
            {step === 0 ? (
              <button type="button" onClick={() => onClose(false)} className="min-h-[48px] rounded-full px-4 text-sm font-semibold text-muted hover:text-ink">
                Maybe later
              </button>
            ) : step < 3 ? (
              <button type="button" onClick={next} className="btn-ink">
                Continue <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            ) : (
              <button type="button" onClick={send} className="btn-wa">
                <WhatsAppIcon className="h-5 w-5" /> Send on WhatsApp
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Radio({ on }: { on: boolean }) {
  return (
    <span aria-hidden className={cn('grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition', on ? 'border-ink bg-ink text-white' : 'border-line')}>
      {on && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
    </span>
  );
}

function Row({ k, v, onEdit }: { k: string; v: string; onEdit: () => void }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="w-20 shrink-0 font-semibold text-muted">{k}</dt>
      <dd className="min-w-0 flex-1 font-semibold text-ink">{v}</dd>
      <button type="button" onClick={onEdit} className="-my-2 min-h-[36px] shrink-0 px-1 text-xs font-bold text-rose hover:underline">
        Change<span className="sr-only"> {k.toLowerCase()}</span>
      </button>
    </div>
  );
}
