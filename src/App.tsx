export default function App() {
  return (
    <div className="relative min-h-screen bg-black text-[#bbb] overflow-hidden">
      <div className="pointer-events-none fixed inset-0 opacity-20 bg-[repeating-linear-gradient(to_bottom,rgba(255,255,255,0.12)_0px,rgba(255,255,255,0.12)_1px,transparent_2px,transparent_4px)]" />
      <div className="pointer-events-none fixed inset-0 opacity-20 bg-[radial-gradient(circle,rgba(255,255,255,0.06),transparent_60%)]" />
      <div className="fixed left-1/2 top-1/2 bg-[#010101] border border-white/5 backdrop-blur-sm w-80 -translate-x-1/2 -translate-y-1/2 p-2.5 box-border">
        <div className="flex-row flex gap-4 items-center">
          <img src="/img/pfpnew.jpg" className="h-16 w-16" alt="" />
          <div className="flex flex-col justify-center">
            <h1 className="font-pixel text-3xl m-0 -mt-1 text-white">hvtrs</h1>
            <p className="text-xs m-0 mb-1">fullstack dev, owner of cherri</p>
          </div>
        </div>

        <div className="flex-row flex gap-1 items-center">
          <p className="text-xs opacity-25">projects</p>
          <div className="mt-3 flex-1 mb-3 h-0 border border-white/5"></div>
        </div>

        <div className="flex flex-col gap-1">
          <a href="https://cherrion.top/" target="_blank">
            <div className="bg-white/2 h-9 box-border gap-1.5 flex flex-row px-2 items-center cursor-pointer">
              <img
                src="https://cherrion.top/assets/img/fav.png"
                className="h-6 w-6"
                alt=""
              />
              <p className="font-medium text-sm">cherri</p>
            </div>
          </a>
          <a href="https://eaglercraftextras.github.io/" target="_blank">
            <div className="bg-white/2 h-9 box-border gap-1.5 flex flex-row px-2 items-center cursor-pointer">
              <img
                src="https://eaglercraftextras.github.io/assets/icon.png"
                className="h-6 w-6"
                alt=""
              />
              <p className="font-medium text-sm">eaglercraft extras</p>
            </div>
          </a>
        </div>
        <div className="flex-row flex gap-1 items-center">
          <p className="text-xs opacity-25">organizations</p>
          <div className="mt-3 flex-1 mb-3 h-0 border border-white/5"></div>
        </div>
        <div className="flex flex-col gap-1">
          <a href="https://github.com/nautilus-os/" target="_blank">
            <div className="bg-white/2 h-9 box-border gap-1.5 flex flex-row px-2 items-center cursor-pointer">
              <img
                src="https://avatars.githubusercontent.com/u/240241840?s=200&v=4"
                className="h-6 w-6"
                alt=""
              />
              <p className="font-medium text-sm">nautilus labs</p>
            </div>
          </a>
          <a href="https://wiltedservices.org/" target="_blank">
            <div className="bg-white/2 h-9 box-border gap-1.5 flex flex-row px-2 items-center cursor-pointer">
              <img
                src="https://wiltedservices.org/assets/WILTED%20SERVICES%20(1).png"
                className="h-6 w-6"
                alt=""
              />
              <p className="font-medium text-sm">wilted services</p>
            </div>
          </a>
        </div>
        <div className="flex-row flex gap-1 items-center">
          <p className="text-xs opacity-25">socials</p>
          <div className="mt-3 flex-1 mb-3 h-0 border border-white/5"></div>
        </div>
        <div className="flex flex-col gap-1">
          <a href="#" target="_blank">
            <div className="bg-white/2 h-9 box-border gap-1.5 flex flex-row px-2 items-center cursor-pointer">
              <img
                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ffreelogopng.com%2Fimages%2Fall_img%2F1691730767discord-logo-transparent.png&f=1&nofb=1&ipt=88311198e9bbdbe2b1b65bcb0857906b5c0001f3f40f9d0b5c494c6a3fcb486b"
                className="w-6"
                alt=""
              />
              <p className="font-medium text-sm">@hvtrs on discord</p>
            </div>
          </a>
          <a href="https://wiltedservices.org/" target="_blank">
            <div className="bg-white/2 h-9 box-border gap-1.5 flex flex-row px-2 items-center cursor-pointer">
              <img
                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F046%2F437%2F248%2Fnon_2x%2Fgithub-logo-transparent-background-free-png.png&f=1&nofb=1&ipt=07a71c54fbb331a060c248239ddb33b5bf727710dccf1391417ee8b9db3fd2ee"
                className="h-6 w-6 scale-150"
                alt=""
              />
              <p className="font-medium text-sm">github</p>
            </div>
          </a>
        </div>
        <div className="flex-row flex gap-1 items-center">
          <p className="text-xs opacity-25">skills</p>
          <div className="mt-3 flex-1 mb-3 h-0 border border-white/5"></div>
        </div>
        <div className="flex flex-row flex-wrap gap-1">
          <div className="bg-white/2 h-9.75 w-9.75 box-border flex flex-row justify-center px-2 items-center">
            <i className="devicon-html5-plain colored text-xl"></i>
          </div>
          <div className="bg-white/2 h-9.75 w-9.75 box-border flex flex-row justify-center px-2 items-center">
            <i className="devicon-css3-plain colored text-xl"></i>
          </div>
          <div className="bg-white/2 h-9.75 w-9.75 box-border flex flex-row justify-center px-2 items-center">
            <i className="devicon-javascript-plain colored text-xl"></i>
          </div>
          <div className="bg-white/2 h-9.75 w-9.75 box-border flex flex-row justify-center px-2 items-center">
            <i className="devicon-typescript-plain colored text-xl"></i>
          </div>
          <div className="bg-white/2 h-9.75 w-9.75 box-border flex flex-row justify-center px-2 items-center">
            <i className="devicon-nodejs-plain colored text-xl"></i>
          </div>
          <div className="bg-white/2 h-9.75 w-9.75 box-border flex flex-row justify-center px-2 items-center">
            <i className="devicon-fastify-plain text-xl"></i>
          </div>
          <div className="bg-white/2 h-9.75 w-9.75 box-border flex flex-row justify-center px-2 items-center">
            <i className="devicon-bun-plain text-xl"></i>
          </div>
          <div className="bg-white/2 h-9.75 w-9.75 box-border flex flex-row justify-center px-2 items-center">
            <i className="devicon-astro-plain colored text-xl"></i>
          </div>
          <div className="bg-white/2 h-9.75 w-9.75 box-border flex flex-row justify-center px-2 items-center">
            <i className="devicon-react-plain colored text-xl"></i>
          </div>
          <div className="bg-white/2 h-9.75 w-9.75 box-border flex flex-row justify-center px-2 items-center">
            <i className="devicon-python-plain colored text-xl"></i>
          </div>
          <div className="bg-white/2 h-9.75 w-9.75 box-border flex flex-row justify-center px-2 items-center">
            <i className="devicon-cplusplus-plain colored text-xl"></i>
          </div>
          <div className="bg-white/2 h-9.75 w-9.75 box-border flex flex-row justify-center px-2 items-center">
            <i className="devicon-git-plain colored text-xl"></i>
          </div>
          <div className="bg-white/2 h-9.75 w-9.75 box-border flex flex-row justify-center px-2 items-center">
            <i className="devicon-archlinux-plain colored text-xl"></i>
          </div>
          <div className="bg-white/2 h-9.75 w-9.75 box-border flex flex-row justify-center px-2 items-center">
            <i className="devicon-windows11-plain colored text-xl"></i>
          </div>
        </div>
      </div>
    </div>
  );
}
