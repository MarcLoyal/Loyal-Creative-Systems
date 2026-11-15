"""
Subsets the self-hosted fonts (SPEC 2.3) to what the site uses, to keep them small for
Largest Contentful Paint (SPEC 24). Sources are the @fontsource-variable packages.
Run: pip install fonttools brotli && python3 scripts/subset-fonts.py
"""
from io import BytesIO
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools import subset

ROOT = Path(__file__).resolve().parent.parent
NM = ROOT / "node_modules" / "@fontsource-variable"
OUT = ROOT / "app" / "fonts"

# Basic Latin, Latin-1 (accented names: Ñ, é, ...), typographic punctuation, arrows, €, ™.
UNICODES = (
    list(range(0x20, 0x7F))
    + list(range(0xA0, 0x100))
    + [0x2013, 0x2014, 0x2018, 0x2019, 0x201C, 0x201D, 0x2022, 0x2026, 0x2032, 0x2033, 0x20AC, 0x2122, 0x2190, 0x2192, 0x2212]
)
FEATURES = ["kern", "liga", "calt", "ccmp", "locl", "tnum", "mark", "mkmk"]

FONTS = [
    # (source, output, weight range actually used)
    (NM / "inter/files/inter-latin-wght-normal.woff2", OUT / "inter-latin-wght.woff2", (400, 600)),
    (NM / "montserrat/files/montserrat-latin-wght-normal.woff2", OUT / "montserrat-latin-wght.woff2", (600, 700)),
]

for src, dst, (lo, hi) in FONTS:
    font = TTFont(src)
    font = instantiateVariableFont(font, {"wght": (lo, hi)})
    # Round-trip so the subsetter sees fully loaded tables after instancing.
    buf = BytesIO()
    font.save(buf)
    buf.seek(0)
    font = TTFont(buf)
    opts = subset.Options()
    opts.flavor = "woff2"
    opts.layout_features = FEATURES
    opts.hinting = False
    opts.desubroutinize = True
    opts.name_IDs = ["*"]
    opts.notdef_outline = True
    sub = subset.Subsetter(opts)
    sub.populate(unicodes=UNICODES)
    sub.subset(font)
    font.flavor = "woff2"
    font.save(dst)
    print(f"{dst.name}: {src.stat().st_size // 1024} KB -> {dst.stat().st_size // 1024} KB (wght {lo}-{hi})")
