'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { type ImageName, Photo } from './ui';

export interface GalleryItem {
  name: ImageName;
  alt: string;
  caption: string;
}

/** Bento grid on desktop, swipeable row on phones; any photo opens a keyboard-friendly lightbox. */
/** aboveFold: the gallery is the page's main content (no scroll-reveal, first photo loads at once). */
export function Gallery({ items, aboveFold }: { items: GalleryItem[]; aboveFold?: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);

  const open = (i: number) => {
    setIndex(i);
    dialog.current?.showModal();
  };
  const step = (d: number) => setIndex((i) => (i + d + items.length) % items.length);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (!el.open) return;
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const spans = ['md:col-span-2 md:row-span-2', '', '', 'md:row-span-2', '', 'md:col-span-2', ''];

  return (
    <>
      <ul className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:auto-rows-[190px] md:grid-cols-4 md:gap-4 md:overflow-visible md:px-0 lg:auto-rows-[220px]">
        {items.map((it, i) => (
          <li key={it.name} data-reveal={aboveFold ? undefined : true} className={cn('w-[78%] shrink-0 snap-center md:w-auto', spans[i % spans.length])}>
            <button
              type="button"
              onClick={() => open(i)}
              className="group relative block aspect-[4/3] h-full w-full overflow-hidden rounded-card bg-lavender-soft md:aspect-auto"
              aria-label={`View photo: ${it.caption}`}
            >
              <Photo name={it.name} alt={it.alt} priority={aboveFold && i === 0} sizes="(min-width: 768px) 40vw, 80vw" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <span className="absolute inset-0 bg-gradient-to-t from-ink-deep/70 via-transparent to-transparent opacity-90" />
              <span className="absolute bottom-3 left-4 right-12 text-left text-sm font-semibold text-white">{it.caption}</span>
              <span className="absolute bottom-3 right-3 grid h-8 w-8 place-items-center rounded-full bg-white/20 text-white backdrop-blur transition group-hover:bg-white group-hover:text-ink">
                <Expand className="h-4 w-4" aria-hidden />
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        aria-label="Clinic photo"
        onClick={(e) => e.target === dialog.current && dialog.current?.close()}
        className="m-auto w-[min(92vw,960px)] overflow-visible bg-transparent p-0 backdrop:bg-ink-deep/80"
      >
        <figure className="relative">
          <Photo name={items[index].name} alt={items[index].alt} sizes="92vw" className="max-h-[78vh] w-full rounded-card object-contain" />
          <figcaption className="mt-3 text-center text-sm font-medium text-white">
            {items[index].caption} <span className="text-white/60">· {index + 1} / {items.length}</span>
          </figcaption>
        </figure>
        <button type="button" onClick={() => dialog.current?.close()} aria-label="Close" className="absolute -top-12 right-0 grid h-10 w-10 place-items-center rounded-full bg-white text-ink">
          <X className="h-5 w-5" />
        </button>
        <button type="button" onClick={() => step(-1)} aria-label="Previous photo" className="absolute left-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow-lift">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button type="button" onClick={() => step(1)} aria-label="Next photo" className="absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow-lift">
          <ChevronRight className="h-5 w-5" />
        </button>
      </dialog>
    </>
  );
}
