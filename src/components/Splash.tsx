import { motion } from "motion/react";
import { avatar } from "../data";
import AsciiPfp from "./AsciiPfp";

export default function Splash({ onEnter }: { onEnter: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onEnter}
      className="fixed inset-0 z-50 flex cursor-pointer flex-col items-center justify-center gap-8 bg-black px-4"
      exit={{ opacity: 0, filter: "blur(12px)", scale: 1.04 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      aria-label="click to enter"
    >
      <AsciiPfp src={avatar(160)} className="h-auto w-[min(520px,90vw)]" />
      <h2 className="font-mono text-sm text-neutral-500">
        click to enter<span className="blink">...</span>
      </h2>
    </motion.button>
  );
}
