import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Veil from "./components/Veil";
import Splash from "./components/Splash";
import { DISCORD_ID } from "./data";
import { isLight, useDiscordProfile } from "./lib/hooks";
import { useLanyard } from "./lib/lanyard";
import Profile from "./sections/Profile";
import { GamesCard, SpotifyCard } from "./sections/Activity";
import Projects from "./sections/Projects";
import Buttons from "./sections/Buttons";

const seen = () => {
  try {
    return sessionStorage.getItem("x8r:entered") === "1";
  } catch {
    return false;
  }
};

export default function App() {
  const p = useLanyard();
  const [entered, setEntered] = useState(seen);
  const dc = useDiscordProfile(DISCORD_ID);
  const theme = dc?.theme;

  // apply the live discord theme, and remember it so the next load paints it
  // straight away (see the inline script in index.html)
  useEffect(() => {
    if (!theme) return;
    const root = document.documentElement;
    const scheme = isLight(theme[0]) ? "light" : "dark";
    root.style.setProperty("--theme-a", theme[0]);
    root.style.setProperty("--theme-b", theme[1]);
    root.dataset.scheme = scheme;
    try {
      localStorage.setItem("x8r:theme", JSON.stringify({ a: theme[0], b: theme[1], scheme }));
    } catch {}
  }, [theme]);

  const enter = () => {
    try {
      sessionStorage.setItem("x8r:entered", "1");
    } catch {}
    setEntered(true);
  };

  const rise = (i: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: entered ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.8, delay: 0.15 + i * 0.08, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <>
      <Veil />
      <AnimatePresence>{!entered && <Splash onEnter={enter} />}</AnimatePresence>

      <main className="mx-auto grid max-w-[1080px] grid-cols-1 items-start gap-3 px-4 py-10 sm:py-16 lg:grid-cols-[400px_1fr]">
        <motion.div {...rise(0)} className="lg:sticky lg:top-16">
          <Profile />
        </motion.div>
        <div className="min-w-0 space-y-3">
          <motion.div {...rise(1)}>
            <SpotifyCard sp={p.spotify} />
          </motion.div>
          <motion.div {...rise(2)}>
            <GamesCard games={p.games} />
          </motion.div>
          <motion.div {...rise(3)}>
            <Projects />
          </motion.div>
        </div>
      </main>

      <motion.div {...rise(4)}>
        <Buttons />
        <p className="pb-8 text-center font-mono text-xs text-page-fg/40">x8r.dev</p>
      </motion.div>
    </>
  );
}
