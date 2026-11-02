import Link from 'next/link';
import { CalendarCheck, Phone } from 'lucide-react';
import { telHref } from '@/content/clinic';
import { generalWhatsappHref } from '@/lib/appointment';
import { WhatsAppIcon } from './ui';

/** Thumb-reach actions on phones: Call · WhatsApp · Book. */
export function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 backdrop-blur-xl lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-[1fr_1fr_1.4fr] gap-2">
        <a href={telHref} className="flex h-[52px] flex-col items-center justify-center rounded-2xl text-xs font-semibold text-ink hover:bg-ink/5">
          <Phone className="h-5 w-5 text-rose" aria-hidden />
          Call
        </a>
        <a href={generalWhatsappHref} target="_blank" rel="noopener noreferrer" className="flex h-[52px] flex-col items-center justify-center rounded-2xl text-xs font-semibold text-ink hover:bg-ink/5">
          <WhatsAppIcon className="h-5 w-5 text-wa-deep" />
          WhatsApp
        </a>
        <Link href="/book" className="flex h-[52px] items-center justify-center gap-2 rounded-2xl bg-ink text-sm font-semibold text-white">
          <CalendarCheck className="h-4 w-4" aria-hidden />
          Book
        </Link>
      </div>
    </div>
  );
}
