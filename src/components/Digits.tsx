import { motion } from "motion/react";

// odometer: each digit is a 0-9 strip that springs to its value
export default function Digits({ value, className = "" }: { value: number; className?: string }) {
  const chars = value.toLocaleString("en-US").split("");
  return (
    <span className={`inline-flex overflow-hidden leading-none ${className}`} aria-label={String(value)}>
      {chars.map((c, i) =>
        /\d/.test(c) ? (
          <span key={chars.length - i} className="relative inline-block h-[1em] w-[0.6em] overflow-hidden" aria-hidden="true">
            <motion.span
              // animates `top`, not a transform: transformed text snaps to a
              // different pixel than the static comma/zeros on half-pixel rows
              className="absolute inset-x-0 flex flex-col items-center"
              initial={{ top: "0em" }}
              animate={{ top: `${-Number(c)}em` }}
              transition={{ type: "spring", stiffness: 60, damping: 16, delay: i * 0.06 }}
            >
              {"0123456789".split("").map((d) => (
                <span key={d} className="h-[1em]">
                  {d}
                </span>
              ))}
            </motion.span>
          </span>
        ) : (
          // same 1em box as the digits so it shares their baseline; centred so a
          // full-width mono comma tucks in instead of spilling into the next digit
          <span key={`s${chars.length - i}`} className="flex h-[1em] w-[0.4em] justify-center" aria-hidden="true">
            {c}
          </span>
        ),
      )}
    </span>
  );
}
