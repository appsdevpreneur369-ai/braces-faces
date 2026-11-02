const env = process.env.NEXT_PUBLIC_SITE_ENV || 'development';
const noindex = env !== 'production' || process.env.NEXT_PUBLIC_NOINDEX === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  // Images are pre-sized WebP made by scripts/prepare-images.mjs (sources are small, ≤680px) — no runtime optimiser.
  images: { unoptimized: true },
  async headers() {
    const security = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ];
    const robots = noindex ? [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] : [];
    return [{ source: '/:path*', headers: [...security, ...robots] }];
  },
};
export default nextConfig;
