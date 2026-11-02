// Builds the web images in public/images from the clinic's own photos in images/ (the only place images are made).
// Runs before every build (npm "prebuild"). Output is committed-free: public/images is regenerated each time.
//
// Notes on the sources (2 Nov 2026):
// - Braces & Faces Dental Clinic Poster.png (clinic's poster, 2 Nov 2026): source of the building photo and, via
//   scripts/make-doctor-cutouts.py, the doctor portraits.
// - dr-*.png are 510px social posters ("Meet our doctor"); the people are cut out of them once by
//   scripts/make-doctor-cutouts.py -> images/cutouts/. Low resolution: ask the clinic for real portraits.
// - logo.png (1254px emblem, supplied 2 Nov 2026) is THE logo: header mark + favicon/app icons.
// - main-banner-braces-faces.png is the full lockup with the clinic name (used for JSON-LD / sharing only).
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const src = (f) => path.join(root, 'images', f);
const out = path.join(root, 'public', 'images');
const appDir = path.join(root, 'src', 'app');
fs.mkdirSync(out, { recursive: true });

/** name -> { file, crop?: [left, top, width, height], width? (resize), quality? } */
const jobs = {
  // Building photo from the clinic poster (sharper than exterior-main-name-board.png); crop avoids its rounded corners.
  'clinic-exterior': { file: 'Braces & Faces Dental Clinic Poster.png', crop: [12, 592, 488, 556] },
  'clinic-waiting-room': { file: 'waiting-room.png' },
  'clinic-reception': { file: 'reception.png' },
  'clinic-reception-desk': { file: 'reception-new.png' },
  'clinic-operatory': { file: 'interior-treatment-chair.png' },
  'clinic-operatory-2': { file: 'treatment-equipment-new.png' },
  'clinic-operatory-3': { file: 'treatment-equipment.png' },
  // Transparent cut-outs (scripts/make-doctor-cutouts.py) — the page puts the speciality colour behind them.
  'dr-bharghav-rayala': { file: 'cutouts/dr-bharghav-rayala.png', width: 560, alpha: true },
  'dr-sai-meghana-yarlagadda': { file: 'cutouts/dr-sai-meghana-yarlagadda.png', width: 560, alpha: true },
  'logo-lockup': { file: 'main-banner-braces-faces.png', crop: [0, 40, 510, 425], quality: 92 },
  'logo-emblem': { file: 'logo.png', width: 256, quality: 90 },
};

const meta = {};
for (const [name, job] of Object.entries(jobs)) {
  let img = job.alpha ? sharp(src(job.file)) : sharp(src(job.file)).flatten({ background: '#ffffff' });
  if (job.crop) {
    const [left, top, width, height] = job.crop;
    img = img.extract({ left, top, width, height });
  }
  if (job.width) img = img.resize({ width: job.width, kernel: 'lanczos3' });
  const file = path.join(out, `${name}.webp`);
  const info = await img.webp({ quality: job.quality ?? 82, effort: 5 }).toFile(file);
  meta[name] = { src: `/images/${name}.webp`, width: info.width, height: info.height };
}
fs.writeFileSync(path.join(root, 'src', 'content', 'images.generated.json'), JSON.stringify(meta, null, 2) + '\n');

// Favicon / app icon: the emblem on a white rounded tile (the logo's own colours, readable on light and dark tabs).
const emblem = await sharp(src('logo.png')).flatten({ background: '#ffffff' }).png().toBuffer();
const tile = (size, radius) =>
  Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" fill="#ffffff"/></svg>`);
const icon = async (size, radius, file) => {
  const inner = Math.round(size * 0.86);
  const mark = await sharp(emblem).resize({ width: inner, height: inner, fit: 'contain', background: '#ffffff' }).toBuffer();
  await sharp(tile(size, radius)).composite([{ input: mark, gravity: 'center' }]).png().toFile(file);
};
await icon(256, 56, path.join(appDir, 'icon.png'));
await icon(180, 0, path.join(appDir, 'apple-icon.png'));

console.log(`prepare-images: ${Object.keys(meta).length} images + 2 icons`);
