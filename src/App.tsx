import { useMemo, useState } from "react";
import Starfield from "./Starfield";
import NavRail, { type SectionId } from "./components/NavRail";
import ViewCounter from "./components/ViewCounter";
import { useLanyard } from "./lib/useLanyard";
import Home from "./sections/Home";
import Work from "./sections/Work";
import Music from "./sections/Music";
import Announcements from "./sections/Announcements";
import { ANNOUNCEMENTS } from "./data";

function hasUnseenPosts(): boolean {
  try {
    const seen = new Set(JSON.parse(localStorage.getItem("seen_posts") ?? "[]"));
    return ANNOUNCEMENTS.some((a) => !seen.has(`${a.date}::${a.title}`));
  } catch {
    return false;
  }
}

export default function App() {
  const [section, setSection] = useState<SectionId>("home");
  const lanyard = useLanyard();

  const navDots = useMemo<SectionId[]>(() => {
    if (section === "announcements") return [];
    return hasUnseenPosts() ? ["announcements"] : [];
  }, [section]);

  return (
    <div className="relative min-h-screen overflow-x-hidden text-bone selection:bg-accent/25">
      <Starfield />
      <div className="grid-bg" />
      <div className="vignette" />

      <NavRail active={section} onSelect={setSection} dots={navDots} />
      <ViewCounter />

      <main className="relative z-[2] mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 pb-20 pt-28">
        {section === "home" && (
          <Home key="home" lanyard={lanyard} onGoto={setSection} />
        )}
        {section === "work" && <Work key="work" />}
        {section === "music" && <Music key="music" lanyard={lanyard} />}
        {section === "announcements" && <Announcements key="announcements" />}
      </main>
    </div>
  );
}
