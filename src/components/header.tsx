import { Button } from "@/components/ui/button";
import { Settings, Newspaper, Home } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur-xl shadow-lg shadow-black/20">
      <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500/20 rounded-xl blur-md group-hover:bg-cyan-500/30 transition-all" />
            <div className="relative p-1 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 text-cyan-400 group-hover:from-cyan-500/20 group-hover:to-blue-500/20 transition-all duration-300">
              <Image
                src="/favicon.png"
                alt="N2K Logo"
                width={65}
                height={65}
                className="h-8 w-8 sm:h-10 sm:w-10 object-contain"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-white uppercase italic group-hover:text-cyan-400 transition-colors">
              GIFTCODE{" "}
              <span className="text-cyan-400 group-hover:text-white transition-colors">
                CENTER
              </span>
            </span>
            <span className="text-[8px] sm:text-[9px] text-gray-500 uppercase tracking-wider hidden sm:block">
              Free codes daily
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/">
            <Button
              variant="ghost"
              className="text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-300 gap-2 h-9 sm:h-10 px-3 sm:px-4 rounded-xl group"
            >
              <Home className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline font-medium">Home</span>
            </Button>
          </Link>
          <Link href="/blog">
            <Button
              variant="ghost"
              className="text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-300 gap-2 h-9 sm:h-10 px-3 sm:px-4 rounded-xl group"
            >
              <Newspaper className="h-4 w-4 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline font-medium">Blog</span>
            </Button>
          </Link>
          <Link href="/admin">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white hover:bg-white/10 h-9 w-9 sm:h-10 sm:w-10 rounded-xl transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-purple-500/0 group-hover:from-cyan-500/10 group-hover:to-purple-500/10 transition-all duration-300" />
              <Settings className="h-4 w-4 sm:h-5 sm:w-5 relative z-10 group-hover:rotate-90 transition-transform duration-300" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
