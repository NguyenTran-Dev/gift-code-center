import { Button } from "@/components/ui/button";
import { Gamepad2, Settings } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
            <Gamepad2 className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <span className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-white uppercase italic">
            GIFTCODE <span className="text-cyan-400">CENTER</span>
          </span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-6">
          <Link
            href="/blog"
            className="text-xs sm:text-sm font-medium text-gray-400 hover:text-cyan-400 transition-colors"
          >
            Blog
          </Link>
          <Link href="/admin">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-white hover:bg-white/5 h-8 w-8 sm:h-10 sm:w-10"
            >
              <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
