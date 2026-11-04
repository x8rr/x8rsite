import { BUTTONS, type ButtonItem } from "../data";

function Badge({ b }: { b: ButtonItem }) {
  const img = (
    <img
      src={b.src}
      alt={b.alt}
      title={b.alt}
      loading="lazy"
      className="pixelated h-[31px] w-[88px] transition duration-300 ease-bounce group-hover:-translate-y-1 group-hover:scale-110"
    />
  );
  return b.href ? (
    <a href={b.href} target="_blank" rel="noreferrer" className="group mx-1.5 shrink-0">
      {img}
    </a>
  ) : (
    <span className="group mx-1.5 shrink-0">{img}</span>
  );
}

export default function Buttons() {
  const half = Math.ceil(BUTTONS.length / 2);
  const rows = [BUTTONS.slice(0, half), BUTTONS.slice(half)];
  return (
    <section aria-label="88x31 buttons" className="marquee-pause fade-x mx-auto max-w-[1080px] space-y-2 overflow-hidden py-8">
      {rows.map((row, i) => (
        <div key={i} className={`marquee ${i ? "marquee-reverse" : ""}`} style={{ ["--speed" as string]: `${38 + i * 8}s` }}>
          {/* doubled so the -50% loop is seamless */}
          {[...row, ...row, ...row, ...row].map((b, j) => (
            <Badge key={j} b={b} />
          ))}
        </div>
      ))}
    </section>
  );
}
