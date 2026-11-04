// regenerates public/img/button.gif + button.png from the live github pfp and
// discord profile (theme colours, avatar decoration), so sites hotlinking the
// x8r 88x31 stay current. run by .github/workflows/button.yml every hour.
//
//   node scripts/button/render.mjs           # only rewrites if inputs changed
//   node scripts/button/render.mjs --force   # always rewrites
//
// set CHROME_PATH to use a local chrome instead of playwright's chromium.

import { createHash } from "node:crypto";
import { appendFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import gifenc from "gifenc";
import { PNG } from "pngjs";

const { GIFEncoder, quantize, applyPalette } = gifenc;

const DISCORD_ID = "979137914464247838";
const GITHUB_ID = 159058655;
const FRAMES = 36;
const FRAME_MS = 70;

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "..");
const out = (f) => join(root, "public", "img", f);
const FINGERPRINT = join(here, ".fingerprint");

const bytes = async (url) => {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return Buffer.from(await r.arrayBuffer());
};
const json = async (url) => {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r.json();
};
const hex = (n) => `#${n.toString(16).padStart(6, "0")}`;
const dataUri = (mime, buf) => `data:${mime};base64,${buf.toString("base64")}`;

// same rule the site uses: a light top colour gets dark text
const isLight = (h) => {
  const n = parseInt(h.slice(1), 16);
  return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255 > 0.6;
};

// ---- gather live inputs. if any source is down, bail without touching the
// files rather than render with guessed data
const [pfp, profile, lanyard] = await Promise.all([
  bytes(`https://avatars.githubusercontent.com/u/${GITHUB_ID}?s=96`),
  json(`https://dcdn.dstn.to/profile/${DISCORD_ID}`),
  json(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`),
]);

const tc = profile.user_profile?.theme_colors;
const [a, b] = tc?.length === 2 ? tc.map(hex) : ["#f2dbd3", "#a77c6d"];
const fg = isLight(a) ? `color-mix(in oklab, ${b} 30%, #1d1615)` : "#fff";
const decoAsset = lanyard.data?.discord_user?.avatar_decoration_data?.asset;
const deco = decoAsset
  ? await bytes(`https://cdn.discordapp.com/avatar-decoration-presets/${decoAsset}.png?size=96&passthrough=false`)
  : null;

const css = readFileSync(join(here, "button.css"), "utf8");
const font = readFileSync(join(root, "public", "fonts", "ByteBounce.ttf"));

const fingerprint = createHash("sha256")
  .update(css)
  .update(readFileSync(fileURLToPath(import.meta.url)))
  .update(pfp)
  .update(deco ?? "")
  .update(`${a}${b}`)
  .digest("hex");

const force = process.argv.includes("--force");
const unchanged =
  !force && existsSync(FINGERPRINT) && readFileSync(FINGERPRINT, "utf8").trim() === fingerprint;

const report = (changed) => {
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `changed=${changed}\n`);
};

if (unchanged) {
  console.log("button: inputs unchanged, nothing to do");
  report(false);
  process.exit(0);
}

// ---- render with chrome so it's pixel-identical to the live css version
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
${css.replace('url("/fonts/ByteBounce.ttf")', `url("${dataUri("font/ttf", font)}")`)}
body { margin: 0; background: #000; }
</style></head><body>
<div class="x8r-btn" id="btn" style="--a:${a};--b:${b};--fg:${fg}">
  <span class="pfp"><img src="${dataUri("image/png", pfp)}"></span>
  ${deco ? `<img class="deco" src="${dataUri("image/png", deco)}">` : ""}
  <span class="t">x8r.dev<span class="cur">_</span></span>
</div></body></html>`;

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
  args: ["--font-render-hinting=none", "--disable-font-subpixel-positioning"],
});
const page = await browser.newPage({ viewport: { width: 120, height: 60 }, deviceScaleFactor: 1 });
await page.setContent(html);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(200);

const btn = page.locator("#btn");
const shots = [];
for (let i = 0; i < FRAMES; i++) {
  // shine sweeps for the first half then rests; 1px bob; cursor blinks
  const s = i < 18 ? -20 + (i / 17) * 130 : 140;
  const bob = Math.round(Math.sin((i / FRAMES) * Math.PI * 2));
  const cur = Math.floor(i / 9) % 2 === 0 ? 1 : 0;
  await page.evaluate(
    ([s, bob, cur]) => {
      const e = document.getElementById("btn");
      e.style.setProperty("--s", `${s}px`);
      e.style.setProperty("--bob", `${bob}px`);
      e.style.setProperty("--cur", String(cur));
    },
    [s, bob, cur],
  );
  shots.push(await btn.screenshot());
}
await browser.close();

// ---- png: first frame, for hotlinks that expect a still
writeFileSync(out("button.png"), shots[0]);

// ---- gif: one palette across all frames so colours don't shimmer, and
// repeated frames merged into longer delays
const rgba = shots.map((s) => PNG.sync.read(s).data);
const all = new Uint8Array(rgba.reduce((n, f) => n + f.length, 0));
rgba.reduce((o, f) => (all.set(f, o), o + f.length), 0);
const palette = quantize(all, 128, { format: "rgb565" });
const indexed = rgba.map((f) => applyPalette(f, palette, "rgb565"));

const gif = GIFEncoder();
const { width, height } = PNG.sync.read(shots[0]);
for (let i = 0; i < indexed.length; ) {
  let j = i + 1;
  while (j < indexed.length && Buffer.compare(Buffer.from(indexed[j]), Buffer.from(indexed[i])) === 0) j++;
  gif.writeFrame(indexed[i], width, height, { palette: i === 0 ? palette : undefined, delay: (j - i) * FRAME_MS, repeat: 0 });
  i = j;
}
gif.finish();
writeFileSync(out("button.gif"), gif.bytes());

writeFileSync(FINGERPRINT, `${fingerprint}\n`);
console.log(`button: rendered (theme ${a} -> ${b}, decoration ${decoAsset ? "yes" : "none"})`);
report(true);
