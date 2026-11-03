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

Home (v2, owner 2 Nov 2026 "make it awesome", compared with the Aishwarya site): hero `src/components/home/Hero.tsx` = clinic waiting-room photo blurred under a navy veil + drifting blush/mint light (photos are only 680 px, never shown sharp full-bleed), headline with a rotating word (smile/bite/jaw/face, sr-only full sentence), Google badge (G mark + stars + count), doctor arches with floating speciality chips, doctor-duo chip on phones, quick-action cards (Book/Call/WhatsApp/Directions) overlapping the hero → ticker → speciality cards → concern finder (opens the assistant pre-filled) → how booking works → **Google reviews** (collapsible) → clinic tour → FAQs → visit us → CTA. Pages: `/about`, `/doctors`, `/doctors/[slug]`, `/treatments`, `/gallery`, `/faqs` (FAQPage JSON-LD), `/book`, `/contact`, `/privacy`, 404. Nav: Home · About Us · Treatments · Doctors · Gallery · FAQs · Contact (burger below xl).

**Booking assistant (popup)** `src/components/assistant/*`, rules in `src/lib/assistant.ts` (tests/assistant.test.ts): opens by itself 3 s after load, once per browsing session (`sessionStorage bnf.assistant`), never on `/book` or `/privacy`, never over another dialog; every "Book" CTA (`BookTrigger`, a real `/book` link without JS) opens it too. Steps: what's bothering you (concerns in `src/content/concerns.ts`) → whom to consult (suggested doctor) → when (today only until 7 PM IST / tomorrow / date + time window) → name + mobile → the same WhatsApp message as `/book`. Bottom sheet on phones, focus trap, Esc/backdrop close.

**Google reviews** `src/lib/google-reviews.ts` (server-only) + `GET /api/reviews` + `src/components/GoogleReviews.tsx`: band shows rating/count (fallback from `clinic.ts`); "Read patient reviews" expands it and fetches the latest reviews (Places API returns at most 5) — verbatim, author + relative time as Google gives them, Write-a-review link. Needs server env **`GOOGLE_PLACES_API_KEY`** (never NEXT_PUBLIC); Place ID from `GOOGLE_PLACE_ID` / `clinic.google.placeId`, else found once by text search (name must contain "Braces", address Tadepalli/Vijayawada/522501). Cached a day, failures not cached. Without a key: rating/count + "Open Google reviews" link; review text is never copied into the repo. Pages stay static (the API route is the only dynamic route).

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

**Never build (or run `next dev`) while a `next start` server is running from the same folder:** both write `.next/`, the running server then answers every chunk with its 404 page and the browser shows a blank page / "Application error" (React #423) — no popup, no reveal. Stop the server, build, start again.
| `node scripts/qa/lighthouse.mjs http://localhost:3100 qa/lighthouse-<date>` | Lighthouse mobile + desktop on 7 routes (build with `NEXT_PUBLIC_SITE_ENV=production` first, else noindex costs SEO). Git Bash: prefix `MSYS_NO_PATHCONV=1` when passing route args. |

## Deployment
Same manual pattern as the other clinic sites: Cloud Build image → Cloud Run (`asia-south1`, project `sincere-stock-499113-f1`), 256Mi, port 3000, unauthenticated. Suggested names: image `asia-south1-docker.pkg.dev/sincere-stock-499113-f1/clinicflow/bnf-frontend:<tag>`, staging service `bnf-frontend-staging` with build args `NEXT_PUBLIC_SITE_ENV=staging`, `NEXT_PUBLIC_NOINDEX=true`, `NEXT_PUBLIC_SITE_URL=<url>`. Production: `NEXT_PUBLIC_SITE_ENV=production` (hides "To confirm" badges, allows indexing) — only after the list above is confirmed. No API CORS changes are needed (the site calls no API).

## Work log
- **2026-11-02** — Site built from the owner's brief (local only, git initialised, not committed/pushed, not deployed). New logo `images/logo.png` adopted for header/footer/icons; doctor portraits + building photo taken from the clinic poster. Checked: tsc, lint, 17/17 tests, `next build` (all pages static); local `next start` at 390/1280 — 8 pages 200 + 404 page, no horizontal overflow, no console errors; booking flow (empty submit → 3 errors, `?doctor=&treatment=` prefill, filled form → `wa.me/918866922449?text=` with every detail).
- **2026-11-02 (later)** — Owner fixes: nav items lost the rounded focus box (underline on active only); fonts → Sora + Nunito Sans (as Aishwarya), italics removed, heading leading loosened; working-hours bar above the header (all widths); hero "Open now" chip removed (in the bar now), phone CTA → "or call" link; mobile tagline no longer wraps. Speed: fade-up animation is transform-only (text LCP no longer waits for opacity), hero/logo images eager instead of high-priority preloads, fixed-size open-now placeholder + action bar; 3 a11y fixes (rating `role="img"`, treatment numbers + WhatsApp preview contrast). Lighthouse (local prod build, `qa/lighthouse-2026-11-02/`): SEO 100 / A11y 100 / BP 100 on all 14 runs; desktop Perf 100 ×7; mobile Perf 91–95 (book CLS 0.09 = intro text re-wrap on font swap, under the 0.1 'good' line). tsc, lint, 17/17 tests, build clean; no overflow at 390/1280. Still local only (not committed, not deployed).
- **2026-11-02 (evening)** — Owner: hero "very bad", Google icon missing, wants collapsible Google reviews, a 3-second "what's the problem / whom / when" popup, Aishwarya-style nav (Home, About…). Built: new hero (see Design), quick actions, Google G badge + reviews band (live via Places API once `GOOGLE_PLACES_API_KEY` is set on the Cloud Run service — not set yet; reading the Aishwarya service's key was refused by the permission guard), booking assistant popup, `/about`, `/gallery`, `/faqs`, 7-item nav, canonicals on every page, sitemap +3. QA: tsc, lint, 27/27 tests; popup flow in a real browser at 390 + 1280 (auto-open ~3 s, suggestion, validation, wa.me message identical to /book, Esc, once per session, not on /book, Book CTA opens it, 0 console errors); no overflow at 390/1280 on all new pages. Lighthouse (local prod build): SEO/A11y/BP 100 on all 20 runs; desktop Perf 99–100; mobile 90–95 except /gallery 87 (photo LCP under simulated throttling). Committed locally, NOT pushed, NOT on staging (owner tests first). Staging deploy of `e136e87` still pending the owner's `gcloud run deploy` (see Deployment).
- **2026-11-02 (night)** — Owner: popup never appeared. Cause: a build/dev run had replaced `.next/` under the running `next start` server (every chunk 404 → React #423 crash), not the popup code; clean rebuild + restart, verified in the owner's Chrome (popup at ~3 s). Also silenced `Failed to find font override values for font Nunito Sans` (next/font has no metrics for it): `adjustFontFallback: false` + explicit fallback stack.
- **2026-11-02 (night) — STAGING LIVE** (owner: "go ahead with staging deployment"): main `730f9df` pushed; image `asia-south1-docker.pkg.dev/sincere-stock-499113-f1/clinicflow/bnf-frontend:730f9df` (Cloud Build, `cloudbuild.staging.yaml`); new service `bnf-frontend-staging` rev `bnf-frontend-staging-00001-fwz` (first revision, no rollback) at https://bnf-frontend-staging-1071497363324.asia-south1.run.app — 256Mi, :3000, public. Verified: 11 pages + sitemap/robots/api 200, 404 page, `X-Robots-Tag: noindex` + robots Disallow, "To confirm" badges on, no error logs, popup opens in Chrome. `GOOGLE_PLACES_API_KEY` NOT set → reviews show rating/count + Google link only (`live:false`).
- **2026-11-03** — Owner: remove every "To confirm" marker before handover. `cloudbuild.staging.yaml` builds with `NEXT_PUBLIC_SHOW_DRAFT_BADGES=false` (`6165f48`); staging `bnf-frontend-staging-00002-kwg` (rollback `00001-fwz`). 11 pages 200, 0 markers, noindex kept. The 9 facts in "Still to confirm" are now shown unbadged — owner accepted them as-is; WhatsApp/SMS stay on (owner pays).
