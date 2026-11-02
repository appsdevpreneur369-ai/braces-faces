import Link from 'next/link';
import { Motif } from '@/components/ui';

export default function NotFound() {
  return (
    <section className="container-site flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <Motif className="h-28 w-28 text-blush" />
      <h1 className="mt-6 text-4xl font-semibold">This page has gone missing.</h1>
      <p className="mt-3 text-muted">The link may be old. Let’s get you back on track.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-ink">Home</Link>
        <Link href="/book" className="btn-ghost">Book an appointment</Link>
      </div>
    </section>
  );
}
