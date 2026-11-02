"""Doctor portraits cut out of the clinic's poster (images/Braces & Faces Dental Clinic Poster.png, 1199x1312, supplied
2 Nov 2026) -> images/cutouts/*.png (transparent). The older 510px "Meet our doctor" cards (images/dr-*.png) are no longer used.

One-off (needs `pip install "rembg[cpu]"`, downloads the u2net_human_seg model ~176 MB). The PNGs are committed, so the
website build does not need Python. Re-run only if the source posters change. Replace with real portraits when the
clinic sends them (then drop this script).
"""
from pathlib import Path
from PIL import Image
from rembg import new_session, remove

ROOT = Path(__file__).resolve().parent.parent
IMG = ROOT / "images"
(IMG / "cutouts").mkdir(exist_ok=True)
session = new_session("u2net_human_seg")

# (poster, crop box above the printed name label, output, regions to clear = leftover poster lettering)
POSTER = "Braces & Faces Dental Clinic Poster.png"
JOBS = [
    (POSTER, (30, 220, 370, 568), "dr-bharghav-rayala", []),
    (POSTER, (580, 232, 915, 568), "dr-sai-meghana-yarlagadda", []),
]

for poster, box, out, clear in JOBS:
    cut = remove(Image.open(IMG / poster).convert("RGB").crop(box), session=session)
    px = cut.load()
    for x0, y0, x1, y1 in clear:
        for y in range(y0, y1):
            for x in range(x0, x1):
                r, g, b, _ = px[x, y]
                px[x, y] = (r, g, b, 0)
    cut = cut.crop(cut.getbbox())  # trim to the person
    cut.save(IMG / "cutouts" / f"{out}.png")
    print("wrote", out)
