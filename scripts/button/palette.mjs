// two theme colours taken from the pfp, for when the discord profile has no
// nitro theme. shared by the site (src/lib/hooks.ts) and render.mjs so the
// page and the 88x31 agree.
//
// splits the pixels a circular avatar actually shows into their two main tones
// (2-means, seeded from the darkest and lightest pixel) and returns
// [dominant, other] as hex, so a mostly dark pfp gets a dark card like discord.
// px: rgba bytes of a size x size image

const hex = (c) => `#${c.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`;
const lum = (c) => 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2];
const dist = (p, c) => (p[0] - c[0]) ** 2 + (p[1] - c[1]) ** 2 + (p[2] - c[2]) ** 2;

export function paletteFromPixels(px, size) {
  const pts = [];
  const r = size / 2;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      if (px[i + 3] < 128 || Math.hypot(x + 0.5 - r, y + 0.5 - r) > r) continue;
      pts.push([px[i], px[i + 1], px[i + 2]]);
    }
  }
  if (!pts.length) return ["#808080", "#808080"];

  let c = [
    pts.reduce((m, p) => (lum(p) < lum(m) ? p : m)),
    pts.reduce((m, p) => (lum(p) > lum(m) ? p : m)),
  ];
  let n = [0, 0];
  for (let it = 0; it < 12; it++) {
    const sum = [[0, 0, 0], [0, 0, 0]];
    n = [0, 0];
    for (const p of pts) {
      const k = dist(p, c[0]) <= dist(p, c[1]) ? 0 : 1;
      n[k]++;
      sum[k][0] += p[0];
      sum[k][1] += p[1];
      sum[k][2] += p[2];
    }
    c = c.map((old, k) => (n[k] ? sum[k].map((v) => v / n[k]) : old));
  }
  return (n[0] >= n[1] ? [c[0], c[1]] : [c[1], c[0]]).map(hex);
}
