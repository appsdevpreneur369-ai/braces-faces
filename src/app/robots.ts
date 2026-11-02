import type { MetadataRoute } from 'next';
import { NOINDEX, SITE_URL } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return NOINDEX
    ? { rules: { userAgent: '*', disallow: '/' } }
    : { rules: { userAgent: '*', allow: '/' }, sitemap: `${SITE_URL}/sitemap.xml` };
}
