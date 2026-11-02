'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, Copy, Phone, ShieldCheck, Stethoscope } from 'lucide-react';
import { clinic, telHref } from '@/content/clinic';
import { doctors } from '@/content/doctors';
import { specialityMeta, treatments } from '@/content/treatments';
import {
  type AppointmentRequest,
  type Errors,
  MAX_DAYS_AHEAD,
  NOT_SURE,
  TIME_WINDOWS,
  addDays,
  buildMessage,
  clinicToday,
  emptyRequest,
  shortDate,
  validate,
  whatsappHref,
} from '@/lib/appointment';
import { cn } from '@/lib/cn';
import { Photo, WhatsAppIcon } from './ui';

const ORDER: (keyof AppointmentRequest)[] = ['name', 'phone', 'age', 'date', 'notes'];

export function BookingForm({ compact }: { compact?: boolean }) {
  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;
  const [req, setReq] = useState<AppointmentRequest>(emptyRequest);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [today, setToday] = useState<string>('');
  const formRef = useRef<HTMLFormElement>(null);

  // Prefill from ?doctor=…&treatment=… (links on doctor and treatment pages). Read once after mount.
  useEffect(() => {
    setToday(clinicToday());
    const p = new URLSearchParams(window.location.search);
    const doctor = p.get('doctor');
    const treatment = p.get('treatment');
    setReq((r) => {
      const next = { ...r };
      if (doctor && doctors.some((d) => d.slug === doctor)) next.doctor = doctor;
      const t = treatments.find((x) => x.id === treatment);
      if (t) {
        next.treatment = t.id;
        if (next.doctor === NOT_SURE) next.doctor = specialityMeta[t.speciality].doctorSlug;
      }
      return next;
    });
  }, []);

  const set = <K extends keyof AppointmentRequest>(k: K, v: AppointmentRequest[K]) => {
    setReq((r) => {
      const next = { ...r, [k]: v };
      if (submitted) setErrors(validate(next));
      return next;
    });
    setSent(false);
  };

  const chooseDoctor = (slug: string) => {
    setReq((r) => {
      const t = treatments.find((x) => x.id === r.treatment);
      const doc = doctors.find((d) => d.slug === slug);
      // Drop a treatment that belongs to the other specialist.
      const keep = !t || !doc || t.speciality === doc.speciality;
      return { ...r, doctor: slug, treatment: keep ? r.treatment : '' };
    });
    setSent(false);
  };

  const visibleTreatments = useMemo(() => {
    const doc = doctors.find((d) => d.slug === req.doctor);
    return doc ? treatments.filter((t) => t.speciality === doc.speciality) : treatments;
  }, [req.doctor]);

  const quickDates = useMemo(() => {
    if (!today) return [];
    return [0, 1, 2, 3].map((n) => {
      const iso = addDays(today, n);
      const label = n === 0 ? 'Today' : n === 1 ? 'Tomorrow' : shortDate(iso);
      return { iso, label };
    });
  }, [today]);

  const message = useMemo(() => buildMessage(req), [req]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const found = validate(req);
    setErrors(found);
    const first = ORDER.find((k) => found[k]);
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    const href = whatsappHref(req);
    const win = window.open(href, '_blank', 'noopener,noreferrer');
    if (!win) window.location.href = href;
    setSent(true);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const err = (k: keyof AppointmentRequest) =>
    errors[k] ? (
      <p id={id(`${k}-err`)} className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-rose">
        <AlertCircle className="h-4 w-4" aria-hidden /> {errors[k]}
      </p>
    ) : null;
  const aria = (k: keyof AppointmentRequest) => ({
    'aria-invalid': errors[k] ? true : undefined,
    'aria-describedby': errors[k] ? id(`${k}-err`) : undefined,
  });

  const errorCount = Object.keys(errors).length;

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className={cn('card overflow-hidden', compact ? '' : 'lg:grid lg:grid-cols-[1fr_340px]')}>
      <div className="p-5 sm:p-8">
        {submitted && errorCount > 0 ? (
          <div role="alert" className="mb-6 rounded-xl border border-rose/30 bg-blush-soft px-4 py-3 text-sm font-medium text-rose">
            Please check {errorCount === 1 ? 'one detail' : `${errorCount} details`} below.
          </div>
        ) : null}

        {/* 1. Doctor */}
        <fieldset>
          <legend className="label flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-ink text-xs text-white">1</span> Who would you like to see?
          </legend>
          <div className="mt-2 grid gap-3 sm:grid-cols-3">
            {doctors.map((d) => {
              const active = req.doctor === d.slug;
              return (
                <label
                  key={d.slug}
                  className={cn(
                    'relative flex cursor-pointer items-center gap-3 rounded-2xl border p-3 transition',
                    active ? (d.speciality === 'orthodontics' ? 'border-rose bg-blush-soft' : 'border-teal bg-mint-soft') : 'border-line bg-white hover:border-ink/30',
                  )}
                >
                  <input type="radio" name="doctor" value={d.slug} checked={active} onChange={() => chooseDoctor(d.slug)} className="sr-only" />
                  <Photo name={d.image} alt="" sizes="48px" className={cn('h-12 w-12 shrink-0 rounded-full object-cover object-top', d.speciality === 'orthodontics' ? 'bg-blush' : 'bg-mint')} />
                  <span className="min-w-0">
                    <span className="block text-sm font-bold leading-tight text-ink">{d.name}</span>
                    <span className="mt-0.5 block text-xs text-muted">{d.specialityLabel}</span>
                  </span>
                  {active ? <CheckCircle2 className={cn('absolute right-2 top-2 h-4 w-4', d.speciality === 'orthodontics' ? 'text-rose' : 'text-teal')} aria-hidden /> : null}
                </label>
              );
            })}
            <label
              className={cn(
                'relative flex cursor-pointer items-center gap-3 rounded-2xl border p-3 transition',
                req.doctor === NOT_SURE ? 'border-ink bg-lavender-soft' : 'border-line bg-white hover:border-ink/30',
              )}
            >
              <input type="radio" name="doctor" value={NOT_SURE} checked={req.doctor === NOT_SURE} onChange={() => chooseDoctor(NOT_SURE)} className="sr-only" />
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white ring-1 ring-line">
                <Stethoscope className="h-5 w-5 text-ink" aria-hidden />
              </span>
              <span>
                <span className="block text-sm font-bold leading-tight text-ink">Not sure</span>
                <span className="mt-0.5 block text-xs text-muted">Help me decide</span>
              </span>
              {req.doctor === NOT_SURE ? <CheckCircle2 className="absolute right-2 top-2 h-4 w-4 text-ink" aria-hidden /> : null}
            </label>
          </div>
        </fieldset>

        {/* 2. Patient */}
        <fieldset className="mt-8">
          <legend className="label flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-ink text-xs text-white">2</span> Patient details
          </legend>
          <div className="mt-2 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor={id('name')} className="label">Full name <span className="text-rose">*</span></label>
              <input id={id('name')} name="name" autoComplete="name" className="field" value={req.name} onChange={(e) => set('name', e.target.value)} placeholder="Patient’s name" {...aria('name')} />
              {err('name')}
            </div>
            <div>
              <label htmlFor={id('phone')} className="label">Mobile number <span className="text-rose">*</span></label>
              <div className="flex">
                <span className="inline-flex items-center rounded-l-xl border border-r-0 border-line bg-paper px-3 text-[15px] font-semibold text-muted">+91</span>
                <input id={id('phone')} name="phone" type="tel" inputMode="numeric" autoComplete="tel-national" className="field rounded-l-none" value={req.phone} onChange={(e) => set('phone', e.target.value)} placeholder="98xxx xxxxx" {...aria('phone')} />
              </div>
              {err('phone')}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor={id('age')} className="label">Age</label>
                <input id={id('age')} name="age" inputMode="numeric" className="field" value={req.age} onChange={(e) => set('age', e.target.value.replace(/\D/g, '').slice(0, 3))} placeholder="Years" {...aria('age')} />
              </div>
              <div>
                <label htmlFor={id('gender')} className="label">Gender</label>
                <select id={id('gender')} name="gender" className="field appearance-none" value={req.gender} onChange={(e) => set('gender', e.target.value)}>
                  <option value="">—</option>
                  <option>Female</option>
                  <option>Male</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="col-span-2 -mt-2">{err('age')}</div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor={id('treatment')} className="label">What is the visit for?</label>
              <select id={id('treatment')} name="treatment" className="field appearance-none" value={req.treatment} onChange={(e) => set('treatment', e.target.value)}>
                <option value="">Consultation / check-up</option>
                {(['orthodontics', 'maxillofacial'] as const).map((s) => {
                  const list = visibleTreatments.filter((t) => t.speciality === s);
                  return list.length ? (
                    <optgroup key={s} label={specialityMeta[s].label}>
                      {list.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </optgroup>
                  ) : null;
                })}
                <option value="other">Something else (add a note)</option>
              </select>
            </div>
          </div>
        </fieldset>

        {/* 3. When */}
        <fieldset className="mt-8">
          <legend className="label flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-ink text-xs text-white">3</span> Preferred day &amp; time
          </legend>
          <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Quick dates">
            {quickDates.map((q) => (
              <button
                key={q.iso}
                type="button"
                onClick={() => set('date', q.iso)}
                aria-pressed={req.date === q.iso}
                className={cn('min-h-[44px] rounded-full border px-4 text-sm font-semibold transition', req.date === q.iso ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink hover:border-ink/40')}
              >
                {q.label}
              </button>
            ))}
          </div>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={id('date')} className="label">Or pick a date <span className="text-rose">*</span></label>
              <input id={id('date')} name="date" type="date" className="field" min={today || undefined} max={today ? addDays(today, MAX_DAYS_AHEAD) : undefined} value={req.date} onChange={(e) => set('date', e.target.value)} {...aria('date')} />
              {err('date')}
            </div>
            <div>
              <span className="label" id={id('visit-label')}>Visit type</span>
              <div role="radiogroup" aria-labelledby={id('visit-label')} className="grid min-h-[48px] grid-cols-2 rounded-xl border border-line bg-paper p-1">
                {(['first', 'follow-up'] as const).map((v) => (
                  <label key={v} className={cn('flex cursor-pointer items-center justify-center rounded-lg text-sm font-semibold transition', req.visit === v ? 'bg-white text-ink shadow-soft' : 'text-muted')}>
                    <input type="radio" name="visit" value={v} checked={req.visit === v} onChange={() => set('visit', v)} className="sr-only" />
                    {v === 'first' ? 'First visit' : 'Follow-up'}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4">
            <span className="label" id={id('time-label')}>Time of day</span>
            <div role="radiogroup" aria-labelledby={id('time-label')} className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {TIME_WINDOWS.map((t) => (
                <label key={t.id} className={cn('flex min-h-[48px] cursor-pointer items-center justify-center rounded-xl border px-2 text-center text-[13px] font-semibold leading-tight transition', req.time === t.id ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink hover:border-ink/40')}>
                  <input type="radio" name="time" value={t.id} checked={req.time === t.id} onChange={() => set('time', t.id)} className="sr-only" />
                  {t.label}
                </label>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <label htmlFor={id('notes')} className="label">Anything the doctor should know? <span className="font-normal text-muted">(optional)</span></label>
            <textarea id={id('notes')} name="notes" rows={3} maxLength={400} className="field resize-none" value={req.notes} onChange={(e) => set('notes', e.target.value)} placeholder="e.g. pain on the left side since 3 days, previous braces, referred by…" {...aria('notes')} />
            {err('notes')}
          </div>
        </fieldset>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button type="submit" className="btn-wa flex-1 text-base">
            <WhatsAppIcon className="h-5 w-5" /> Send on WhatsApp
          </button>
          <a href={telHref} className="btn-ghost flex-1 text-base">
            <Phone className="h-5 w-5 text-rose" aria-hidden /> Call the clinic
          </a>
        </div>
        <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-muted">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal" aria-hidden />
          Your details go straight from your WhatsApp to the clinic ({clinic.phone.display}). This website does not store them. The clinic will reply to confirm your slot.
        </p>

        {sent ? (
          <div role="status" className="mt-6 rounded-2xl border border-wa/40 bg-wa/10 p-4 text-sm text-ink">
            <p className="flex items-center gap-2 font-bold"><CheckCircle2 className="h-5 w-5 text-wa-deep" aria-hidden /> WhatsApp opened with your request.</p>
            <p className="mt-1 text-body">Press <strong>send</strong> in WhatsApp to reach the clinic. Didn’t open? Copy the message, or call us.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={copy} className="btn-ghost min-h-[40px] px-4 text-sm">
                <Copy className="h-4 w-4" aria-hidden /> {copied ? 'Copied' : 'Copy message'}
              </button>
              <a href={telHref} className="btn-ghost min-h-[40px] px-4 text-sm"><Phone className="h-4 w-4" aria-hidden /> {clinic.phone.display}</a>
            </div>
          </div>
        ) : null}
      </div>

      {/* Live preview of the message the clinic will get */}
      {!compact ? (
        <aside aria-label="Message preview" className="hidden border-l border-line bg-[#EFE7DE] p-6 lg:block">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">What the clinic receives</p>
          <div className="mt-4 rounded-2xl rounded-tr-sm bg-[#D9FDD3] p-4 text-[13px] leading-relaxed text-[#111B21] shadow-soft">
            <WhatsAppMarkup text={message} />
            <p className="mt-2 text-right text-[11px] text-[#4A5A63]">now ✓✓</p>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted">Updates as you type. Nothing is sent until you press send inside WhatsApp.</p>
        </aside>
      ) : null}
    </form>
  );
}

/** Renders WhatsApp's *bold* syntax for the preview. */
function WhatsAppMarkup({ text }: { text: string }) {
  return (
    <>
      {text.split('\n').map((line, i) =>
        line === '' ? (
          <br key={i} />
        ) : (
          <p key={i}>
            {line.split(/(\*[^*]+\*)/g).map((part, j) => (part.startsWith('*') && part.endsWith('*') ? <strong key={j}>{part.slice(1, -1)}</strong> : <span key={j}>{part}</span>))}
          </p>
        ),
      )}
    </>
  );
}
