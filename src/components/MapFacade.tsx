'use client';

import { useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { clinic } from '@/content/clinic';
import { Photo } from './ui';

/** The Google map loads only when asked (no third-party requests on page load). */
export function MapFacade() {
  const [show, setShow] = useState(false);
  if (show) {
    return (
      <iframe
        title="Map to Braces & Faces Dental Clinic"
        src={clinic.mapsEmbed}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-full min-h-[320px] w-full rounded-card border-0"
      />
    );
  }
  return (
    <div className="relative h-full min-h-[320px] overflow-hidden rounded-card">
      <Photo name="clinic-exterior" alt="The building on NH 16 Service Road with the Braces & Faces signboard on the second floor" sizes="(min-width: 1024px) 50vw, 100vw" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-deep/85 via-ink-deep/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-3 p-5">
        <p className="flex items-center gap-2 text-sm font-semibold text-white">
          <MapPin className="h-4 w-4 text-blush" aria-hidden /> Look for our signboard on the 2nd floor
        </p>
        <div className="flex gap-2">
          <button type="button" onClick={() => setShow(true)} className="btn-ghost min-h-[42px] px-4 text-sm">Show map</button>
          <a href={clinic.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-blush min-h-[42px] px-4 text-sm">
            <Navigation className="h-4 w-4" aria-hidden /> Directions
          </a>
        </div>
      </div>
    </div>
  );
}
