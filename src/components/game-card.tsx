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
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Link href={`/game/${game.slug}`}>
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#121212] transition-colors group-hover:border-cyan-500/50">
          <div className="aspect-[3/4] overflow-hidden">
            <Image
              src={game.thumbnail || "https://placehold.co/600x800/222/555?text=Game"}
              alt={game.name}
              width={600}
              height={800}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/60 to-transparent" />
          </div>

          <div className="absolute inset-0 flex flex-col justify-end p-4">
            <Badge className="w-fit mb-2 bg-cyan-600/20 text-cyan-400 border-none hover:bg-cyan-600/30 text-[10px] px-2 py-0">
              {game.category}
            </Badge>
            <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
              {game.name}
            </h3>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-400">
              <Gift className="h-3.5 w-3.5 text-cyan-400" />
              <span>{game._count?.giftcodes || 0} codes</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
