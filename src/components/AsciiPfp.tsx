import { useEffect, useRef } from "react";

const CHARS = " .,:;'`^\"-_~=+*<>!?/\\|()[]{}1iIlLtfjrxnuvczXYUJCQ0OZmwqpdbkhao#MW&8%B@$";
const NOISE = "!<>-_\\/[]{}=+*^?#@$%&";
const FONT_PX = 12;
const CH = 12; // cell height; width comes from the font's real advance
// cells darker than this may thin out; everything else stays inked so the
// colour carries the picture
const DARK = 0.12;
const FLOOR = 0.35;

type Cell = { c: string; color: string } | null;

// coverage of an area split into a 2 wide x 3 tall grid: tone plus rough shape
// (top-heavy, left-heavy, diagonal...). a: one value per pixel, w x h
function features(a: Float32Array, w: number, h: number, x0 = 0, y0 = 0, stride = w): number[] {
  const out = [0, 0, 0, 0, 0, 0];
  const cnt = [0, 0, 0, 0, 0, 0];
  for (let y = 0; y < h; y++) {
    const r = Math.min(2, Math.floor((y * 3) / h));
    for (let x = 0; x < w; x++) {
      const k = r * 2 + (x * 2 < w ? 0 : 1);
      out[k] += a[(y0 + y) * stride + x0 + x];
      cnt[k]++;
    }
  }
  return out.map((v, k) => v / (cnt[k] || 1));
}

// draws each candidate glyph in the page font and measures it
function glyphTable(cw: number) {
  const c = document.createElement("canvas");
  c.width = cw;
  c.height = CH;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.font = `${FONT_PX}px "Geist Mono Variable", monospace`;
  ctx.textBaseline = "top";
  const feats = [...CHARS].map((ch) => {
    ctx.clearRect(0, 0, cw, CH);
    ctx.fillStyle = "#fff";
    ctx.fillText(ch, 0, 0);
    const d = ctx.getImageData(0, 0, cw, CH).data;
    const a = new Float32Array(cw * CH);
    for (let i = 0; i < a.length; i++) a[i] = d[i * 4 + 3] / 255;
    return features(a, cw, CH);
  });
  const max = Math.max(...feats.flat()) || 1;
  return feats.map((f) => f.map((v) => v / max));
}

function rgbToHsv(r: number, g: number, b: number) {
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0;
  if (d) h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [((h * 60 + 360) % 360) / 360, max ? d / max : 0, max];
}
function hsvToRgb(h: number, s: number, v: number) {
  const i = Math.floor(h * 6), f = h * 6 - i;
  const p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - (1 - f) * s);
  return [[v, t, p], [q, v, p], [p, v, t], [p, q, v], [t, p, v], [v, p, q]][i % 6];
}

// the old "believe it or not, this is ascii!" pfp, generated live from the
// github avatar: each cell gets the glyph whose tone + shape best matches that
// patch of the photo, in the photo's own colour, clipped to a true circle and
// decoding in from noise
export default function AsciiPfp({ src, cols = 80, className = "" }: { src: string; cols?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let raf = 0;
    let alive = true;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = async () => {
      await document.fonts.load(`${FONT_PX}px "Geist Mono Variable"`).catch(() => {});
      if (!alive) return;

      const measure = document.createElement("canvas").getContext("2d")!;
      measure.font = `${FONT_PX}px "Geist Mono Variable", monospace`;
      const cw = Math.round(measure.measureText("M").width) || 7;
      // square grid in real pixels, so the circle is a circle
      const rows = Math.round((cols * cw) / CH);
      const W = cols * cw, H = rows * CH;

      const glyphs = glyphTable(cw);

      const sample = document.createElement("canvas");
      sample.width = W;
      sample.height = H;
      const sctx = sample.getContext("2d", { willReadFrequently: true })!;
      sctx.imageSmoothingQuality = "high";
      sctx.drawImage(img, 0, 0, W, H);
      const px = sctx.getImageData(0, 0, W, H).data;

      // luminance, stretched between the 2nd and 98th percentile so the whole
      // range of glyphs gets used
      const lum = new Float32Array(W * H);
      for (let i = 0; i < lum.length; i++) lum[i] = (0.2126 * px[i * 4] + 0.7152 * px[i * 4 + 1] + 0.0722 * px[i * 4 + 2]) / 255;
      const sorted = Float32Array.from(lum).sort();
      const lo = sorted[Math.floor(sorted.length * 0.02)], hi = sorted[Math.floor(sorted.length * 0.98)];
      for (let i = 0; i < lum.length; i++) lum[i] = Math.min(1, Math.max(0, (lum[i] - lo) / (hi - lo || 1)));

      const cells: Cell[] = [];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          if (Math.hypot((x + 0.5) * cw - W / 2, (y + 0.5) * CH - H / 2) > W / 2) {
            cells.push(null);
            continue;
          }
          const f = features(lum, cw, CH, x * cw, y * CH, W).map((v) => (v < DARK ? v : FLOOR + (1 - FLOOR) * v));
          let best = 0, bestErr = Infinity;
          for (let k = 0; k < glyphs.length; k++) {
            let e = 0;
            for (let j = 0; j < 6; j++) e += (glyphs[k][j] - f[j]) ** 2;
            if (e < bestErr) (bestErr = e), (best = k);
          }
          const c = CHARS[best];
          if (c === " ") {
            cells.push(null);
            continue;
          }
          let r = 0, g = 0, b = 0;
          for (let yy = 0; yy < CH; yy++)
            for (let xx = 0; xx < cw; xx++) {
              const o = ((y * CH + yy) * W + x * cw + xx) * 4;
              r += px[o];
              g += px[o + 1];
              b += px[o + 2];
            }
          const n = cw * CH * 255;
          // the photo's colour, a touch more saturated and lifted to read on black
          const [h, s, v] = rgbToHsv(r / n, g / n, b / n);
          const [R, G, B] = hsvToRgb(h, Math.min(1, s * 1.4), Math.min(1, 0.2 + 0.95 * v));
          cells.push({ c, color: `rgb(${(R * 255) | 0},${(G * 255) | 0},${(B * 255) | 0})` });
        }
      }

      const canvas = ref.current!;
      const ctx = canvas.getContext("2d")!;
      const dpr = Math.min(devicePixelRatio, 2);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.scale(dpr, dpr);
      ctx.font = `${FONT_PX}px "Geist Mono Variable", monospace`;
      ctx.textBaseline = "top";

      // each cell settles at its own random moment, centre first
      const settle = cells.map((_, i) => {
        const x = (i % cols) / cols - 0.5, y = Math.floor(i / cols) / rows - 0.5;
        return Math.hypot(x, y) * 1400 + Math.random() * 700;
      });
      const t0 = performance.now();

      const draw = (t: number) => {
        const el = t - t0;
        ctx.clearRect(0, 0, W, H);
        let done = true;
        for (let i = 0; i < cells.length; i++) {
          const cell = cells[i];
          if (!cell) continue;
          let c = cell.c;
          if (el < settle[i]) {
            done = false;
            if (el < settle[i] - 500) continue;
            c = NOISE[(Math.random() * NOISE.length) | 0];
          }
          ctx.fillStyle = cell.color;
          ctx.fillText(c, (i % cols) * cw, Math.floor(i / cols) * CH);
        }
        if (!done) raf = requestAnimationFrame(draw);
      };
      raf = requestAnimationFrame(draw);
    };
    img.src = src;
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
    };
  }, [src, cols]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
