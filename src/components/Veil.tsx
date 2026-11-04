import { useEffect, useRef } from "react";

const VERT = `attribute vec2 p; void main() { gl_Position = vec4(p, 0.0, 1.0); }`;

// domain-warped noise folded into silky ridges, coloured with the two discord
// theme colours. light scheme: pale silk with soft highlights. dark scheme:
// black with the theme glowing through the folds
const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform vec3 uA;
uniform vec3 uB;
uniform float uDark;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 r = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = r * p * 2.02; a *= 0.5; }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y * 1.4;
  float t = uTime * 0.06;

  // the cursor drags the veil a little
  p += (uMouse - 0.5) * 0.25 * vec2(1.0, -1.0);

  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(p + 3.0 * q + vec2(1.7, 9.2) + t * 1.3), fbm(p + 3.0 * q + vec2(8.3, 2.8) - t * 1.1));
  float f = fbm(p + 3.2 * r);

  // folds: thin bright ridges where the warped field crosses bands
  float folds = 0.5 + 0.5 * sin(f * 9.0 + r.x * 4.0 + uTime * 0.25);
  float ridge = pow(folds, 7.0);
  float body = smoothstep(0.15, 0.95, f + 0.25 * length(q));

  vec3 col;
  if (uDark > 0.5) {
    vec3 glow = mix(uA, uB, clamp(r.y * 1.4, 0.0, 1.0));
    col = glow * body * 0.55 + glow * ridge * 0.5;
    col *= smoothstep(1.3, 0.2, length(uv - vec2(0.5, 0.35)));
  } else {
    vec3 silk = mix(uA, uB, clamp(f * 1.35 + 0.15 * q.x, 0.0, 1.0));
    col = mix(silk, uB * 0.82, smoothstep(0.55, 1.0, body) * 0.5);
    col = mix(col, vec3(1.0), ridge * 0.38);
    col *= mix(1.0, 0.86, smoothstep(0.3, 1.2, length(uv - vec2(0.3, 0.75))));
  }

  // fine grain so the gradients don't band
  col += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) * 0.025;
  gl_FragColor = vec4(col, 1.0);
}`;

const parse = (v: string): [number, number, number] | null => {
  const m = v.match(/[\d.]+/g);
  if (!m || m.length < 3 || (m.length > 3 && Number(m[3]) === 0)) return null;
  return [Number(m[0]) / 255, Number(m[1]) / 255, Number(m[2]) / 255];
};

export default function Veil() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false });
    if (!gl) return;

    const shader = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (n: string) => gl.getUniformLocation(prog, n);
    const uRes = u("uRes"), uTime = u("uTime"), uMouse = u("uMouse"), uA = u("uA"), uB = u("uB"), uDark = u("uDark");

    // soft-focus anyway, so render at reduced resolution and let css scale it
    const SCALE = 0.5;
    const resize = () => {
      canvas.width = Math.max(1, Math.round(innerWidth * SCALE));
      canvas.height = Math.max(1, Math.round(innerHeight * SCALE));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };

    // colours come from the theme css vars, starting from whatever is already
    // there (never a guess), then eased so a live theme change blends in
    let dark = 0;
    let want: { ta: number[] | null; tb: number[] | null } = { ta: null, tb: null };
    const readTheme = () => {
      const cs = getComputedStyle(document.documentElement);
      const ta = parse(cs.getPropertyValue("--theme-a"));
      const tb = parse(cs.getPropertyValue("--theme-b"));
      return { ta, tb, isDark: document.documentElement.dataset.scheme !== "light" };
    };

    const mouse = [0.5, 0.5], target = [0.5, 0.5];
    const move = (e: PointerEvent) => {
      target[0] = e.clientX / innerWidth;
      target[1] = e.clientY / innerHeight;
    };

    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t0 = performance.now();
    let raf = 0;
    const draw = (now: number) => {
      const { ta, tb } = want;
      if (ta && tb) for (let i = 0; i < 3; i++) (a[i] += (ta[i] - a[i]) * 0.05), (b[i] += (tb[i] - b[i]) * 0.05);
      mouse[0] += (target[0] - mouse[0]) * 0.03;
      mouse[1] += (target[1] - mouse[1]) * 0.03;
      gl.uniform1f(uTime, still ? 20 : (now - t0) / 1000);
      gl.uniform2f(uMouse, mouse[0], mouse[1]);
      gl.uniform3f(uA, a[0], a[1], a[2]);
      gl.uniform3f(uB, b[0], b[1], b[2]);
      gl.uniform1f(uDark, dark);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!still) raf = requestAnimationFrame(draw);
    };

    // no point burning gpu in a background tab
    const vis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(draw);
    };

    const first = readTheme();
    const a = [...(first.ta ?? [0.95, 0.86, 0.83])], b = [...(first.tb ?? [0.65, 0.49, 0.43])];
    const sync = () => {
      const { ta, tb, isDark } = readTheme();
      want = { ta, tb };
      dark = isDark ? 1 : 0;
      if (still) requestAnimationFrame(draw);
    };
    // App.tsx writes the theme as inline vars + data-scheme on <html>
    const watch = new MutationObserver(sync);
    watch.observe(document.documentElement, { attributes: true, attributeFilter: ["style", "data-scheme"] });

    resize();
    sync();
    raf = requestAnimationFrame(draw);
    addEventListener("resize", resize);
    addEventListener("pointermove", move);
    document.addEventListener("visibilitychange", vis);
    return () => {
      cancelAnimationFrame(raf);
      watch.disconnect();
      removeEventListener("resize", resize);
      removeEventListener("pointermove", move);
      document.removeEventListener("visibilitychange", vis);
    };
  }, []);

  return <canvas ref={ref} className="pointer-events-none fixed inset-0 -z-20 size-full" aria-hidden="true" />;
}
