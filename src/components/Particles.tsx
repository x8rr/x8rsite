import { useEffect, useRef } from "react";

// a quiet take on the old particles.js background: drifting dots that
// reach out to the cursor ("grab" mode)
export default function Particles() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(devicePixelRatio, 2);
    const mouse = { x: -9999, y: -9999 };
    let w = 0, h = 0, raf = 0;
    let dots: { x: number; y: number; vx: number; vy: number; r: number; a: number }[] = [];

    const resize = () => {
      w = innerWidth;
      h = innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round((w * h) / 14000);
      dots = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.3 + 0.4,
        a: Math.random() * 0.5 + 0.15,
      }));
    };

    // dot colour comes from the theme (--particle), re-read now and then so a
    // light/dark switch carries over
    let rgb = "255,255,255", tick = 0;
    const frame = () => {
      if (tick++ % 60 === 0) {
        rgb = getComputedStyle(document.documentElement).getPropertyValue("--particle").trim().split(/\s+/).join(",") || rgb;
      }
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        if (!still) {
          d.x = (d.x + d.vx + w) % w;
          d.y = (d.y + d.vy + h) % h;
        }
        const dist = Math.hypot(d.x - mouse.x, d.y - mouse.y);
        if (dist < 150) {
          ctx.strokeStyle = `rgba(${rgb},${(1 - dist / 150) * 0.35})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
        ctx.fillStyle = `rgba(${rgb},${d.a})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    };

    const move = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const leave = () => {
      mouse.x = mouse.y = -9999;
    };

    resize();
    frame();
    addEventListener("resize", resize);
    addEventListener("pointermove", move);
    document.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", resize);
      removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, []);

  return <canvas ref={ref} className="pointer-events-none fixed inset-0 -z-10 size-full" aria-hidden="true" />;
}
