'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { concernById } from '@/content/concerns';
import { AUTO_OPEN_DELAY_MS, SESSION_KEY, type SessionState, canAutoOpen } from '@/lib/assistant';

export type AssistantPrefill = { concern?: string; doctor?: string };
type Ctx = { open: (prefill?: AssistantPrefill) => void };
const AssistantCtx = createContext<Ctx | null>(null);

// The dialog (and its booking logic) is only downloaded when it first opens.
const AssistantDialog = dynamic(() => import('./AssistantDialog').then((m) => m.AssistantDialog), { ssr: false });

const readSession = (): SessionState => {
  try {
    return (sessionStorage.getItem(SESSION_KEY) as SessionState) ?? null;
  } catch {
    return null;
  }
};
const writeSession = (v: Exclude<SessionState, null>) => {
  try {
    sessionStorage.setItem(SESSION_KEY, v);
  } catch {
    /* private mode: popup may show again, harmless */
  }
};

/** Booking assistant: opens from any "Book" trigger, and once per session by itself after 3 seconds. */
export function AssistantProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [state, setState] = useState<{ open: boolean; auto: boolean; prefill: AssistantPrefill }>({ open: false, auto: false, prefill: {} });
  const opener = useRef<HTMLElement | null>(null);

  const open = useCallback((prefill: AssistantPrefill = {}) => {
    opener.current = document.activeElement as HTMLElement | null;
    writeSession('shown');
    setState({ open: true, auto: false, prefill });
  }, []);

  const close = useCallback((sent: boolean) => {
    if (sent) writeSession('sent');
    setState((s) => ({ ...s, open: false }));
    requestAnimationFrame(() => opener.current?.focus?.());
  }, []);

  useEffect(() => {
    const check = () => canAutoOpen({ pathname, session: readSession(), anotherDialogOpen: !!document.querySelector('dialog[open], [role="dialog"]') });
    if (!check()) return;
    const t = window.setTimeout(() => {
      if (!check()) return; // the visitor may have opened it (or a lightbox) during the delay
      opener.current = document.activeElement as HTMLElement | null;
      writeSession('shown');
      setState({ open: true, auto: true, prefill: {} });
    }, AUTO_OPEN_DELAY_MS);
    return () => window.clearTimeout(t);
  }, [pathname]);

  return (
    <AssistantCtx.Provider value={{ open }}>
      {children}
      {state.open && <AssistantDialog auto={state.auto} prefill={state.prefill} onClose={close} />}
    </AssistantCtx.Provider>
  );
}

export function useAssistant(): Ctx {
  const c = useContext(AssistantCtx);
  if (!c) throw new Error('useAssistant must be used inside <AssistantProvider>');
  return c;
}

/** A real link to /book (works without JS) that opens the assistant instead when JS is running. */
export function BookTrigger({ className, children, prefill, onClick }: { className?: string; children: ReactNode; prefill?: AssistantPrefill; onClick?: () => void }) {
  const { open } = useAssistant();
  const c = prefill?.concern ? concernById(prefill.concern) : undefined;
  const q = new URLSearchParams();
  const doctor = prefill?.doctor ?? c?.doctor?.slug;
  if (doctor) q.set('doctor', doctor);
  if (c?.treatment && c.treatment !== 'other') q.set('treatment', c.treatment);
  const qs = q.toString();
  const href = qs ? `/book?${qs}` : '/book';
  return (
    <a
      href={href}
      className={className}
      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        onClick?.();
        open(prefill);
      }}
    >
      {children}
    </a>
  );
}
