import type { MetadataRoute } from 'next';
import { doctors } from '@/content/doctors';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['', '/about', '/doctors', ...doctors.map((d) => `/doctors/${d.slug}`), '/treatments', '/gallery', '/faqs', '/book', '/contact', '/privacy'];
  return paths.map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: 'monthly', priority: p === '' ? 1 : 0.7 }));
}
