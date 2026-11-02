import Link from 'next/link';
import { cn } from '@/lib/cn';
import { Photo } from './ui';

/** Emblem from the clinic's logo + wordmark in the site heading face (Sora). */
export function Logo({ dark, className }: { dark?: boolean; className?: string }) {
  return (
    <Link href="/" aria-label="Braces & Faces Dental Clinic — home" className={cn('group flex items-center gap-3', className)}>
      <span className={cn('grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full bg-white ring-1', dark ? 'ring-white/20' : 'ring-line')}>
        <Photo name="logo-emblem" alt="" className="h-11 w-11 object-contain" sizes="48px" eager />
      </span>
      <span className="leading-none">
        <span className={cn('block font-heading text-[19px] font-bold tracking-[-0.02em]', dark ? 'text-white' : 'text-ink')}>
          Braces <span className="text-rose">&amp;</span> Faces
        </span>
        <span className={cn('mt-1 block whitespace-nowrap text-[9.5px] font-bold uppercase tracking-[0.1em] xs:text-[10.5px] xs:tracking-[0.14em]', dark ? 'text-white/60' : 'text-muted')}>
          Dental · Maxillofacial · Ortho
        </span>
      </span>
    </Link>
  );
}
