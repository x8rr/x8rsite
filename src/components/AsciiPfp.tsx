import { useEffect, useRef } from "react";

const RAMP = " .'`^,:;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";
const NOISE = "!<>-_\\/[]{}=+*^?#@$%&";

// the old "believe it or not, this is ascii!" pfp, but generated live from the
// github avatar, coloured per character, and decoding in from noise
export default function AsciiPfp({ src, cols = 72, className = "" }: { src: string; cols?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let raf = 0;
    let alive = true;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (!alive) return;
      const rows = Math.round(cols * 0.5);
      const sample = document.createElement("canvas");
      sample.width = cols;
      sample.height = rows;
      const sctx = sample.getContext("2d", { willReadFrequently: true })!;
      sctx.drawImage(img, 0, 0, cols, rows);
      const px = sctx.getImageData(0, 0, cols, rows).data;

      // read the art as ink: dark lines and colour are dense, white paper is
      // empty, all clipped to the round pfp
      const cells = Array.from({ length: cols * rows }, (_, i) => {
        const x = ((i % cols) + 0.5) / cols - 0.5, y = (Math.floor(i / cols) + 0.5) / rows - 0.5;
        if (Math.hypot(x, y) > 0.5) return null;
        const r = px[i * 4], g = px[i * 4 + 1], b = px[i * 4 + 2];
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        const ink = Math.max(1 - (0.299 * r + 0.587 * g + 0.114 * b) / 255, max ? ((max - min) / max) * 0.9 : 0);
        if (ink < 0.08) return null;
        const dense = Math.pow(ink, 0.7);
        // lift dark ink so it reads on black
        const k = 0.45;
        const color = `rgb(${r + (255 - r) * k},${g + (255 - g) * k},${b + (255 - b) * k})`;
        return { c: RAMP[Math.min(RAMP.length - 1, Math.floor(dense * RAMP.length))], color };
      });

      const canvas = ref.current!;
      const ctx = canvas.getContext("2d")!;
      const cw = 8, ch = 14, dpr = Math.min(devicePixelRatio, 2);
      canvas.width = cols * cw * dpr;
      canvas.height = rows * ch * dpr;
      ctx.scale(dpr, dpr);
      ctx.font = `${ch - 2}px "Geist Mono Variable", monospace`;
      ctx.textBaseline = "top";

      // each cell settles at its own random moment, centre first
      const settle = Array.from({ length: cols * rows }, (_, i) => {
        const x = (i % cols) / cols - 0.5, y = Math.floor(i / cols) / rows - 0.5;
        return Math.hypot(x, y) * 1400 + Math.random() * 700;
      });
      const t0 = performance.now();

      const draw = (t: number) => {
        const el = t - t0;
        ctx.clearRect(0, 0, cols * cw, rows * ch);
        let done = true;
        for (let i = 0; i < cols * rows; i++) {
          const cell = cells[i];
          if (!cell) continue;
          let c = cell.c;
          if (el < settle[i]) {
            done = false;
            if (el < settle[i] - 500) continue;
            c = NOISE[(Math.random() * NOISE.length) | 0];
          }
          ctx.fillStyle = cell.color;
          ctx.fillText(c, (i % cols) * cw, Math.floor(i / cols) * ch);
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
