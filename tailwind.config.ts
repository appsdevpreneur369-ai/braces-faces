import type { Config } from 'tailwindcss';

// Palette taken from the clinic's own artwork (2 Nov 2026): navy from the doctors' posters, blush from the tooth in the
// logo (orthodontics), mint from the face (maxillofacial), lavender from the logo's centre band.
// Text-safe deep tones (rose, teal) pass WCAG AA on paper/white; blush/mint are fills or accents on navy only.
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    screens: { xs: '400px', sm: '640px', md: '768px', lg: '1024px', xl: '1280px' },
    extend: {
      colors: {
        ink: { DEFAULT: '#1E234F', deep: '#13163A', soft: '#2B3166' },
        blush: { DEFAULT: '#FBBAB7', soft: '#FDE8E6' },
        rose: '#A93F55',
        mint: { DEFAULT: '#D1E7EB', soft: '#EAF5F4' },
        teal: '#1C6765',
        lavender: { DEFAULT: '#8F8CB8', soft: '#EEEDF6' },
        paper: '#FBF9F7',
        line: '#E7E3EC',
        body: '#3A3E5C',
        muted: '#5C6080',
        wa: { DEFAULT: '#25D366', deep: '#128C4A' },
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'system-ui', 'Segoe UI', 'Arial', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'Segoe UI', 'Arial', 'sans-serif'],
        
      },
      maxWidth: { site: '76rem' },
      borderRadius: { card: '1.25rem' },
      boxShadow: {
        soft: '0 1px 2px rgb(30 35 79 / 0.05), 0 8px 24px -12px rgb(30 35 79 / 0.18)',
        lift: '0 2px 6px rgb(30 35 79 / 0.06), 0 24px 48px -20px rgb(30 35 79 / 0.35)',
      },
      keyframes: {
        // Transform only (no opacity): above-the-fold text paints at once, so it is never a late LCP.
        'fade-up': { from: { transform: 'translateY(12px)' }, to: { transform: 'none' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'sheet-up': { from: { transform: 'translateY(100%)' }, to: { transform: 'none' } },
        'pop-in': { from: { opacity: '0', transform: 'translateY(12px) scale(.97)' }, to: { opacity: '1', transform: 'none' } },
        drift: { '0%,100%': { transform: 'translate3d(0,0,0) scale(1)' }, '50%': { transform: 'translate3d(4%,-6%,0) scale(1.08)' } },
        'drift-r': { '0%,100%': { transform: 'translate3d(0,0,0) scale(1.05)' }, '50%': { transform: 'translate3d(-5%,5%,0) scale(.95)' } },
        // Hero rotating word: 4 words, each held ~2.2s, sliding up.
        words: {
          '0%,20%': { transform: 'translateY(0)' },
          '25%,45%': { transform: 'translateY(-25%)' },
          '50%,70%': { transform: 'translateY(-50%)' },
          '75%,95%': { transform: 'translateY(-75%)' },
          '100%': { transform: 'translateY(-75%)' },
        },
        'spin-slow': { to: { transform: 'rotate(360deg)' } },
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
      },
      animation: {
        'fade-up': 'fade-up .7s cubic-bezier(.2,.7,.2,1) both',
        float: 'float 6s ease-in-out infinite',
        'sheet-up': 'sheet-up .35s cubic-bezier(.2,.8,.2,1) both',
        'pop-in': 'pop-in .3s cubic-bezier(.2,.8,.2,1) both',
        drift: 'drift 18s ease-in-out infinite',
        'drift-r': 'drift-r 22s ease-in-out infinite',
        words: 'words 9s cubic-bezier(.7,0,.3,1) infinite',
        'spin-slow': 'spin-slow 40s linear infinite',
        marquee: 'marquee 40s linear infinite',
      },
    },
  },
  plugins: [],
};
export default config;
