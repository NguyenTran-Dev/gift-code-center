import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-gradient-to-t from-black/80 to-transparent backdrop-blur-xl py-4 sm:py-6 mt-6 sm:mt-8">
      <div className="container mx-auto px-4 text-center space-y-2 sm:space-y-1">
        <p className="text-gray-500 text-xs sm:text-sm">
          © 2026 GIFTCODE CENTER. All rights reserved.
        </p>
        <div className="flex items-center justify-center gap-2 text-gray-600 text-[10px] sm:text-xs">
          <span>Website thuộc bản quyền của</span>
          <div className="relative group">
            <div className="absolute -inset-2 bg-cyan-500/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            <Image
              src="/favicon.png"
              alt="N2K Logo"
              width={60}
              height={25}
              className="inline-block relative transition-transform group-hover:scale-110"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
