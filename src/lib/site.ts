export const SITE_ENV = process.env.NEXT_PUBLIC_SITE_ENV || 'development';
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
/** Anything that is not production is never indexed. */
export const NOINDEX = SITE_ENV !== 'production' || process.env.NEXT_PUBLIC_NOINDEX === 'true';
/** "To confirm" badges on facts the clinic still has to verify. Default: on everywhere except production. */
export const SHOW_DRAFT_BADGES = process.env.NEXT_PUBLIC_SHOW_DRAFT_BADGES ? process.env.NEXT_PUBLIC_SHOW_DRAFT_BADGES === 'true' : SITE_ENV !== 'production';
