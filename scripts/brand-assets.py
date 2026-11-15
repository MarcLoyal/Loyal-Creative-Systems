"""
Derives the brand files from logo.png (SPEC 2.1). Run: python3 scripts/brand-assets.py
The artwork is never redrawn: every output is a crop of the supplied file with its
white background converted to transparency ("colour to alpha"), optionally recoloured
to white for dark backgrounds.
"""
from pathlib import Path
from PIL import Image
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "logo.png"
OUT = ROOT / "public" / "brand"
APP = ROOT / "app"

# Regions in the supplied 1344x896 file (left, top, right, bottom), measured from the artwork.
FULL = (168, 258, 1177, 624)      # mark + wordmark + tagline
LOCKUP = (168, 258, 1177, 574)    # mark + wordmark (header and footer: tagline is illegible at nav size)
MARK = (278, 258, 1080, 483)      # "LCS" letters only
PAD = 6
NOISE = 0.10


def to_alpha(rgb: np.ndarray) -> np.ndarray:
    """White background → transparent, keeping anti-aliased edges clean."""
    c = rgb.astype(np.float64) / 255.0
    a = (1.0 - c).max(axis=2)                       # distance from white
    # The source has compression noise up to ~9% away from the artwork; drop it so the
    # white version on dark backgrounds shows no specks.
    a = np.clip((a - NOISE) / (1.0 - NOISE), 0.0, 1.0)
    safe = np.where(a > 0, a, 1.0)[..., None]
    col = np.clip((c - (1.0 - safe)) / safe, 0.0, 1.0)
    return np.dstack([col, a]).__mul__(255).round().astype(np.uint8)


def crop(img: np.ndarray, box) -> Image.Image:
    l, t, r, b = box
    return Image.fromarray(img[t - PAD : b + PAD, l - PAD : r + PAD], "RGBA")


def white(im: Image.Image) -> Image.Image:
    """Single-colour white version. Solid areas are made fully opaque (the source fills are
    not perfectly uniform, which shows as streaks once flattened to one colour); edges keep
    their anti-aliasing."""
    arr = np.array(im).astype(np.float64)
    arr[..., :3] = 255
    arr[..., 3] = np.clip(arr[..., 3] * 1.6, 0, 255)
    return Image.fromarray(arr.round().astype(np.uint8), "RGBA")


def on_square(mark: Image.Image, size: int, bg=(255, 255, 255, 255), fill=0.84) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), bg)
    w = round(size * fill)
    h = round(mark.height * w / mark.width)
    m = mark.resize((w, h), Image.LANCZOS)
    canvas.alpha_composite(m, ((size - w) // 2, (size - h) // 2))
    return canvas


def main():
    rgba = to_alpha(np.array(Image.open(SRC).convert("RGB")))
    OUT.mkdir(parents=True, exist_ok=True)

    outputs = {
        "logo-full.png": crop(rgba, FULL),
        "logo.png": crop(rgba, LOCKUP),
        "mark.png": crop(rgba, MARK),
    }
    for name, im in list(outputs.items()):
        outputs[name.replace(".png", "-white.png")] = white(im)
    for name, im in outputs.items():
        im.save(OUT / name, optimize=True)
        print(name, im.size)

    mark = outputs["mark.png"]
    on_square(mark, 512).save(APP / "icon.png", optimize=True)
    on_square(mark, 180).save(APP / "apple-icon.png", optimize=True)
    ico = on_square(mark, 256, fill=0.9)
    ico.save(APP / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])

    og = Image.new("RGBA", (1200, 630), (255, 255, 255, 255))
    full = outputs["logo-full.png"]
    w = 880
    h = round(full.height * w / full.width)
    og.alpha_composite(full.resize((w, h), Image.LANCZOS), ((1200 - w) // 2, (630 - h) // 2))
    og.convert("RGB").save(APP / "opengraph-image.png", optimize=True)
    print("icons and opengraph-image written")


if __name__ == "__main__":
    main()
