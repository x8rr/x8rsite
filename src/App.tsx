import { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";

type DiscordStatus = "online" | "idle" | "dnd" | "offline";

export default function App() {
  const [status, setStatus] = useState<DiscordStatus>("offline");

  useEffect(() => {
    const fetchDiscordStatus = async () => {
      try {
        const response = await fetch(
          "https://api.lanyard.rest/v1/users/979137914464247838",
        );
        const data = await response.json();

        if (data.success && data.data) {
          const userData = data.data;
          const currentStatus = (userData.discord_status ||
            "offline") as DiscordStatus;

          setStatus(currentStatus);
        }
      } catch (error) {
        console.error("Failed to fetch Discord status:", error);
        setStatus("offline");
      }
    };

    fetchDiscordStatus();
    const interval = setInterval(fetchDiscordStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const statusColors: Record<DiscordStatus, string> = {
    online: "#23a55a",
    idle: "#faa61a",
    dnd: "#f23636",
    offline: "#747f8d",
  };

  const statusLabels: Record<DiscordStatus, string> = {
    online: "Online",
    idle: "Idle",
    dnd: "Do Not Disturb",
    offline: "Offline",
  };

  return (
    <div className="relative min-h-screen bg-[#181619] text-[#e3dbe4] flex items-center justify-center font-geist antialiased selection:bg-[#ffb7da]/30 selection:text-white">
      <div className="pointer-events-none fixed inset-0 opacity-15 bg-[repeating-linear-gradient(to_bottom,rgba(255,183,218,0.08)_0px,rgba(255,183,218,0.08)_1px,transparent_2px,transparent_4px)]" />
      <div className="pointer-events-none fixed inset-0 opacity-30 bg-[radial-gradient(circle,rgba(255,183,218,0.05),transparent_60%)]" />

      <div className="w-[340px] bg-[#231f24] border border-[#362e37] rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.4)] relative">
        <div className="h-[105px] w-full relative overflow-hidden bg-[#2d252f]">
          <img
            src="/img/banner.jpg"
            className="w-full h-full object-cover opacity-90"
            alt=""
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#231f24]/40 to-transparent" />
        </div>

        <div className="px-4 pb-4 relative">
          <div className="absolute -top-[45px] left-3">
            <div className="relative group">
              <div className="w-[84px] h-[84px] rounded-full bg-[#231f24] flex items-center justify-center p-[5px]">
                <img
                  src="/img/pfp.png"
                  className="w-full h-full rounded-full bg-[#181619] object-cover"
                  alt="Profile"
                />
              </div>

              <div
                className="absolute bottom-0.5 right-0.5 w-[24px] h-[24px] rounded-full border-[4px] border-[#231f24] flex items-center justify-center shadow-lg transition-colors duration-300"
                style={{ backgroundColor: statusColors[status] }}
                title={statusLabels[status]}
              ></div>
            </div>
          </div>

          <div className="pt-[48px]">
            <h1 className="text-xl font-bold text-[#fceeff] tracking-tight leading-tight">
              hvtrs (x8r)
            </h1>
            <p className="text-[13px] text-[#ccaec0] mt-0.5 font-normal">
              fullstack dev, owner of cherri, developer at vortex
            </p>
          </div>

          <div className="mt-4 bg-[#181619]/90 rounded-xl p-3 border border-[#312832] space-y-3.5 backdrop-blur-md">
            <div>
              <h2 className="text-[11px] font-bold text-[#ffb7da] uppercase tracking-wider mb-2 opacity-90">
                Projects
              </h2>
              <div className="space-y-1">
                <a
                  href="https://cherrion.top/"
                  target="_blank"
                  className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-[#ffb7da]/10 transition-all duration-200 group"
                >
                  <img
                    src="https://cherrion.top/assets/img/fav.png"
                    className="h-[18px] w-[18px] rounded-md object-contain"
                    alt=""
                  />
                  <span className="text-[13px] font-medium text-[#e3dbe4] group-hover:text-[#ffcfe6] transition-colors">
                    cherri
                  </span>
                  <span className="text-[10px] text-[#ffb7da] ml-auto opacity-0 group-hover:opacity-80 transition-all transform translate-x-1 group-hover:translate-x-0">
                    <ExternalLink height={12} width={12} />
                  </span>
                </a>
                <a
                  href="https://eaglercraftextras.github.io/"
                  target="_blank"
                  className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-[#ffb7da]/10 transition-all duration-200 group"
                >
                  <img
                    src="https://eaglercraftextras.github.io/assets/icon.png"
                    className="h-[18px] w-[18px] rounded-md object-contain"
                    alt=""
                  />
                  <span className="text-[13px] font-medium text-[#e3dbe4] group-hover:text-[#ffcfe6] transition-colors">
                    eaglercraft extras
                  </span>
                  <span className="text-[10px] text-[#ffb7da] ml-auto opacity-0 group-hover:opacity-80 transition-all transform translate-x-1 group-hover:translate-x-0">
                    <ExternalLink height={12} width={12} />
                  </span>
                </a>
                <a
                  href="#"
                  target=""
                  className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-[#ffb7da]/10 transition-all duration-200 group"
                >
                  <img
                    src="/img/stratus.svg"
                    className="h-[18px] w-[18px] rounded-md object-contain"
                    alt=""
                  />
                  <span className="text-[13px] font-medium text-[#e3dbe4] group-hover:text-[#ffcfe6] transition-colors">
                    stratus (WIP)
                  </span>
                  <span className="text-[10px] text-[#ffb7da] ml-auto opacity-0 group-hover:opacity-80 transition-all transform translate-x-1 group-hover:translate-x-0">
                    <ExternalLink height={12} width={12} />
                  </span>
                </a>
              </div>
            </div>

            <div className="w-full h-[1px] bg-[#362e37]/50" />

            <div>
              <h2 className="text-[11px] font-bold text-[#ffb7da] uppercase tracking-wider mb-2 opacity-90">
                Organizations
              </h2>
              <div className="space-y-1">
                <a
                  href="https://github.com/nautilus-os/"
                  target="_blank"
                  className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-[#ffb7da]/10 transition-all duration-200 group"
                >
                  <img
                    src="https://avatars.githubusercontent.com/u/240241840?s=200&v=4"
                    className="h-[18px] w-[18px] rounded-md object-contain"
                    alt=""
                  />
                  <span className="text-[13px] font-medium text-[#e3dbe4] group-hover:text-[#ffcfe6] transition-colors">
                    nautilus labs
                  </span>
                  <span className="text-[10px] text-[#ffb7da] ml-auto opacity-0 group-hover:opacity-80 transition-all transform translate-x-1 group-hover:translate-x-0">
                    <ExternalLink height={12} width={12} />
                  </span>
                </a>
                <a
                  href="https://wiltedservices.org/"
                  target="_blank"
                  className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-[#ffb7da]/10 transition-all duration-200 group"
                >
                  <img
                    src="https://wiltedservices.org/assets/WILTED%20SERVICES%20(1).png"
                    className="h-[18px] w-[18px] rounded-md object-contain"
                    alt=""
                  />
                  <span className="text-[13px] font-medium text-[#e3dbe4] group-hover:text-[#ffcfe6] transition-colors">
                    wilted services
                  </span>
                  <span className="text-[10px] text-[#ffb7da] ml-auto opacity-0 group-hover:opacity-80 transition-all transform translate-x-1 group-hover:translate-x-0">
                    <ExternalLink height={12} width={12} />
                  </span>
                </a>
              </div>
            </div>

            <div className="w-full h-[1px] bg-[#362e37]/50" />

            <div>
              <h2 className="text-[11px] font-bold text-[#ffb7da] uppercase tracking-wider mb-2 opacity-90">
                Socials
              </h2>
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-[#ffb7da]/10 transition-all duration-200 group cursor-pointer">
                  <img
                    src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ffreelogopng.com%2Fimages%2Fall_img%2F1691730767discord-logo-transparent.png&f=1&nofb=1&ipt=88311198e9bbdbe2b1b65bcb0857906b5c0001f3f40f9d0b5c494c6a3fcb486b"
                    className="w-[18px] h-[14px] object-contain brightness-120 filter sepia-[30%] hue-rotate-[80deg]"
                    alt=""
                  />
                  <span className="text-[13px] font-medium text-[#e3dbe4] group-hover:text-[#ffcfe6] transition-colors">
                    @hvtrs
                  </span>
                </div>
                <a
                  href="https://github.com/x8rr"
                  target="_blank"
                  className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-[#ffb7da]/10 transition-all duration-200 group"
                >
                  <img
                    src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F046%2F437%2F248%2Fnon_2x%2Fgithub-logo-transparent-background-free-png.png&f=1&nofb=1&ipt=07a71c54fbb331a060c248239ddb33b5bf727710dccf1391417ee8b9db3fd2ee"
                    className="w-[35px] h-[35px] object-contain invert brightness-90 -m-2 group-hover:brightness-100 transition-all"
                    alt=""
                  />
                  <span className="text-[13px] font-medium text-[#e3dbe4] group-hover:text-[#ffcfe6] transition-colors">
                    github
                  </span>
                  <span className="text-[10px] text-[#ffb7da] ml-auto opacity-0 group-hover:opacity-80 transition-all transform translate-x-1 group-hover:translate-x-0">
                    <ExternalLink height={12} width={12} />
                  </span>
                </a>
              </div>
            </div>

            <div className="w-full h-[1px] bg-[#362e37]/50" />

            <div>
              <h2 className="text-[11px] font-bold text-[#ffb7da] uppercase tracking-wider mb-2 opacity-90">
                Skills
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "html5",
                  "css3",
                  "javascript",
                  "typescript",
                  "nodejs",
                  "fastify",
                  "bun",
                  "astro",
                  "react",
                  "python",
                  "cplusplus",
                  "git",
                  "archlinux",
                  "windows11",
                ].map((skill) => {
                  const needsInvert = ["fastify", "bun"].includes(skill);
                  return (
                    <div
                      key={skill}
                      className="bg-[#2d252f]/40 border border-[#3b313d] hover:border-[#ffb7da]/40 w-[34px] h-[34px] rounded-lg flex items-center justify-center transition-all duration-200 group"
                      title={skill}
                    >
                      <i
                        className={`devicon-${skill}-plain ${
                          needsInvert
                            ? "text-[#fceeff] opacity-80 group-hover:opacity-100"
                            : "colored"
                        } text-[18px] transition-transform group-hover:scale-110`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="fixed bottom-3 left-1/2 -translate-x-1/2 text-xs opacity-10">
        as long as i have nitro, i'm forced to be a femboy
      </p>
    </div>
  );
}
