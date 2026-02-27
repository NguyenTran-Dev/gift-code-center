"use client";

import { Badge } from "@/components/ui/badge";
import { Game } from "@prisma/client";
import { motion } from "framer-motion";
import { Gift } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface GameCardProps {
  game: Game & { _count?: { giftcodes: number } };
}

export function GameCard({ game }: GameCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group"
    >
      <Link href={`/game/${game.slug}`}>
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#121212] transition-all duration-300 group-hover:border-cyan-500/50 group-hover:shadow-lg group-hover:shadow-cyan-500/20">
          {/* Glow effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-blue-500/0 to-purple-500/0 group-hover:from-cyan-500/10 group-hover:via-blue-500/10 group-hover:to-purple-500/10 transition-all duration-500 pointer-events-none" />

          <div className="aspect-[3/4] overflow-hidden">
            <Image
              src={
                game.thumbnail ||
                "https://placehold.co/600x800/222/555?text=Game"
              }
              alt={game.name}
              width={600}
              height={800}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/60 to-transparent" />
          </div>

          <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-4">
            <Badge className="w-fit mb-2 bg-cyan-600/20 backdrop-blur-sm text-cyan-400 border border-cyan-500/30 hover:bg-cyan-600/30 text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0 transition-all">
              {game.category}
            </Badge>
            <h3 className="text-sm sm:text-base md:text-lg font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1 drop-shadow-lg">
              {game.name}
            </h3>
            <div className="mt-1 flex items-center gap-1.5 text-[10px] sm:text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
              <Gift className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-cyan-400 group-hover:animate-pulse" />
              <span>{game._count?.giftcodes || 0} codes</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
