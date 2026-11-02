import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Braces & Faces Dental Clinic',
    short_name: 'Braces & Faces',
    start_url: '/',
    display: 'standalone',
    background_color: '#FBF9F7',
    theme_color: '#13163A',
    icons: [{ src: '/icon.png', sizes: '256x256', type: 'image/png' }],
  };
}
