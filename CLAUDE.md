# CLAUDE.md — Braces & Faces Dental Clinic website (BNF)

Public website for **Braces & Faces Dental Clinic — Maxillofacial and Orthodontic Centre**, 2nd Floor, Mourya's Icon, near State Bank, NH 16 Service Road, Tadepalli, Vijayawada, Andhra Pradesh 522501 (project code **BNF**). Phone **+91 88669 22449**. Hours **10 AM – 8 PM**.

Consultants:
- **Dr. Bharghav Rayala** — MDS, Orthodontics & Dentofacial Orthopaedics. Shown as *Consultant Orthodontist & Dentofacial Orthopaedist*.
- **Dr. Sai Meghana Yarlagadda** — MDS, Dip. OGS, Oral & Maxillofacial Surgery. Shown as *Consultant Oral & Maxillofacial Surgeon*.

Built 2 Nov 2026. **ClinicFlow247 "Custom Starter": website only.** The clinic already uses other practice software, so there is **no** ClinicFlow booking, patient portal, tenant file, API call or WhatsApp Business API here. Appointment requests go out as a **pre-filled WhatsApp message (wa.me link)** from the patient's own phone, or the patient calls. Do not add ClinicFlow integration, accounts, OTP, reminders or a database unless the owner asks for a plan upgrade.

## How booking works (the only "feature")
- `/book` (also reached with `?doctor=<slug>&treatment=<id>` from doctor/treatment/concern links) → `src/components/BookingForm.tsx`.
- Fields: doctor (or "Not sure"), name*, mobile* (Indian, 10 digits), age, gender, visit reason (treatment list filtered by doctor), preferred date* (today … +90 days, **IST**), time window, first visit / follow-up, note.
- **Send on WhatsApp** validates, then opens `https://wa.me/918866922449?text=…` with every detail (`src/lib/appointment.ts` → `buildMessage`). Nothing is stored; the site has no server code. A live preview shows the exact message (desktop). After opening: "Copy message" + Call fallback.
- **Call the clinic** = `tel:+918866922449`. Call / WhatsApp / Book are also in the header, footer, hero and the phone bottom bar.
- The message is a *request*: copy everywhere says the clinic confirms the slot. Never claim a booking is confirmed.

## Facts and their source (2 Nov 2026, owner's brief)
All clinic/doctor facts live in `src/content/*.ts`. Never invent phone, email, registration numbers, experience, prices, reviews, patient counts or outcomes. Items marked `verify` show a dashed **"To confirm"** badge on non-production builds (`NEXT_PUBLIC_SHOW_DRAFT_BADGES`, default on unless `NEXT_PUBLIC_SITE_ENV=production`).

**Still to confirm with the clinic before production:**
1. Building name: Google listing says **Akshara Building**, clinic details say **Mourya's Icon** (site uses Mourya's Icon).
2. WhatsApp number — assumed same as the phone (88669 22449).
3. Opening days — only "10 am till 8 pm" given; is Sunday open?
4. Google rating — brief said "5.055 Google reviews", read as **5.0 from 55 reviews**.
5. Dr. Sai Meghana's **Dip. OGS** (exact qualification) — also printed on the clinic poster.
6. **Pitts braces** branding; **Invisalign provider** status (the poster shows the Invisalign Provider mark, but the brief asked to verify before using it).
7. Which procedures are done in-clinic vs hospital/referral (site says larger surgery "may be planned in a hospital setting").
8. Years of experience, consultation timings per doctor (not shown anywhere until given).
9. Doctor portraits are cut out of the clinic poster (~335 px wide, AI-enhanced look). Ask for original high-resolution photos.

## Images
Sources in `images/` (the clinic's own; never use stock for doctors or the clinic). `scripts/prepare-images.mjs` (runs on every `npm run build`) writes WebP to `public/images/`, `src/content/images.generated.json`, and `src/app/icon.png` / `apple-icon.png`. Change crops there only.
- **`images/logo.png` is the logo** (1254 px emblem, supplied 2 Nov 2026): header/footer mark, favicon, app icon. The wordmark next to it is live text (Sora).
- `Braces & Faces Dental Clinic Poster.png` (clinic poster, 1199×1312, supplied 2 Nov 2026): source of the **building photo** (crop) and the **doctor portraits**. Portraits are cut out once by `scripts/make-doctor-cutouts.py` (Python + `rembg[cpu]`, model `u2net_human_seg`) → `images/cutouts/*.png` (transparent; committed so the site build needs no Python). The page puts the speciality colour behind them (blush = Dr. Bharghav, mint = Dr. Sai Meghana).
- `main-banner-braces-faces.png` = full lockup with name (structured data only).
- Not used: `dr-bhargav.png` / `dr-meghana.png` (510 px social cards, replaced by the poster cut-outs), `exterior-main-name-board.png` (narrow 264 px crop; the poster's building photo is sharper).

## Design
Different from the other clinic sites (Aishwarya violet, SPDC/SMSDC teal, DR-SINDHU blue). Palette from the clinic's own artwork (`tailwind.config.ts`): navy `#1E234F` / `#13163A` (doctor posters), **blush** `#FBBAB7` = orthodontics (the tooth in the logo), **mint** `#D1E7EB` = maxillofacial (the face), lavender band. Text-safe deep tones `rose #A93F55`, `teal #1C6765`; blush/mint are fills or accents on navy only. Fonts (owner, 2 Nov 2026: same pairing as the Aishwarya site): **Sora** (headings + wordmark), **Nunito Sans** (body), via next/font in `src/app/layout.tsx`. No italic emphasis (Sora has no italic) — emphasis is colour only. Headings need leading ≥ 1.1 (Sora is tall). Pill buttons, 20 px cards, scroll-reveal (`data-reveal`, off for reduced motion), tooth-meets-face line motif (`Motif`).

Header: navy **working-hours bar** first (hours, open-now, address on lg, phone + WhatsApp on md; scrolls away) → sticky white 72px header. Nav items are plain text — no box/pill/rounded focus outline; only a rose underline on the current page (also hover/keyboard focus) — `.nav-link` in `globals.css`.

Home: navy hero (clinic photo + floating doctor chips, open-now chip, rating/specialists/hours strip) → treatment ticker → two speciality cards → "Start with what's bothering you" concern finder (deep-links to booking) → how booking works → clinic tour (bento + lightbox) → Google rating band (links to Google, no copied reviews) → FAQs → visit us (map loads on click) → CTA. Pages: `/doctors`, `/doctors/[slug]`, `/treatments`, `/book`, `/contact`, `/privacy`, 404.

## Hard rules
- **Ask the owner first** before pushing to GitHub, creating cloud services, or deploying anything. Never touch ClinicFlow core, `clinicflow-lb`, DNS or other services.
- Read-only: `D:\ClinicFlow`, `D:\AISHWARYA`, `D:\SPDC`, `D:\DR-SINDHU`, `D:\SMSDC`. Copy here is original — do not paste wording from the Aishwarya site.
- No medical promises (durations, prices, success rates). General info only.

## Commands
| Command | What |
| --- | --- |
| `npm run dev` | Dev server (http://localhost:3000) |
| `npm run build && npm start` | Production build/run (`prebuild` makes the images). On this machine use `NEXT_BUILD_CPUS=1` if build workers crash on low RAM. |
| `npm test` | Vitest: mobile validation, IST dates, WhatsApp message + link, open-hours |
| `npm run check` | lint + typecheck + tests + build |
| `npm run images` | Regenerate images/icons only |
| `node scripts/qa/lighthouse.mjs http://localhost:3100 qa/lighthouse-<date>` | Lighthouse mobile + desktop on 7 routes (build with `NEXT_PUBLIC_SITE_ENV=production` first, else noindex costs SEO). Git Bash: prefix `MSYS_NO_PATHCONV=1` when passing route args. |

## Deployment (not done yet — owner's go needed)
Same manual pattern as the other clinic sites: Cloud Build image → Cloud Run (`asia-south1`, project `sincere-stock-499113-f1`), 256Mi, port 3000, unauthenticated. Suggested names: image `asia-south1-docker.pkg.dev/sincere-stock-499113-f1/clinicflow/bnf-frontend:<tag>`, staging service `bnf-frontend-staging` with build args `NEXT_PUBLIC_SITE_ENV=staging`, `NEXT_PUBLIC_NOINDEX=true`, `NEXT_PUBLIC_SITE_URL=<url>`. Production: `NEXT_PUBLIC_SITE_ENV=production` (hides "To confirm" badges, allows indexing) — only after the list above is confirmed. No API CORS changes are needed (the site calls no API).

## Work log
- **2026-11-02** — Site built from the owner's brief (local only, git initialised, not committed/pushed, not deployed). New logo `images/logo.png` adopted for header/footer/icons; doctor portraits + building photo taken from the clinic poster. Checked: tsc, lint, 17/17 tests, `next build` (all pages static); local `next start` at 390/1280 — 8 pages 200 + 404 page, no horizontal overflow, no console errors; booking flow (empty submit → 3 errors, `?doctor=&treatment=` prefill, filled form → `wa.me/918866922449?text=` with every detail).
- **2026-11-02 (later)** — Owner fixes: nav items lost the rounded focus box (underline on active only); fonts → Sora + Nunito Sans (as Aishwarya), italics removed, heading leading loosened; working-hours bar above the header (all widths); hero "Open now" chip removed (in the bar now), phone CTA → "or call" link; mobile tagline no longer wraps. Speed: fade-up animation is transform-only (text LCP no longer waits for opacity), hero/logo images eager instead of high-priority preloads, fixed-size open-now placeholder + action bar; 3 a11y fixes (rating `role="img"`, treatment numbers + WhatsApp preview contrast). Lighthouse (local prod build, `qa/lighthouse-2026-11-02/`): SEO 100 / A11y 100 / BP 100 on all 14 runs; desktop Perf 100 ×7; mobile Perf 91–95 (book CLS 0.09 = intro text re-wrap on font swap, under the 0.1 'good' line). tsc, lint, 17/17 tests, build clean; no overflow at 390/1280. Still local only (not committed, not deployed).
