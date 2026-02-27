import { GiftcodeCard } from "@/components/giftcode-card";
import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { Giftcode } from "@prisma/client";
import { ChevronLeft, Gift, Info, Share2 } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const game = await prisma.game.findUnique({
    where: { slug },
  });

  if (!game) return { title: "Game not found" };

  return {
    title: `${game.name} Giftcode mới nhất | Giftcode Center`,
    description: `Danh sách toàn bộ giftcode mới nhất cho game ${game.name}. Cập nhật liên tục.`,
  };
}

export default async function GameDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = await prisma.game.findUnique({
    where: { slug },
    include: {
      giftcodes: {
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!game) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a]">
      <Header />

      <main className="container mx-auto flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-400 hover:text-cyan-400 mb-8 transition-colors group"
        >
          <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:-translate-x-1" />
          Quay lại danh sách game
        </Link>

        {/* Game Hero */}
        <section className="relative mb-12 overflow-hidden rounded-3xl border border-white/10 bg-[#121212]">
          <div className="absolute inset-0 opacity-20 blur-3xl saturate-200">
            <div className="absolute top-0 right-0 h-64 w-64 bg-cyan-500 rounded-full" />
            <div className="absolute bottom-0 left-0 h-64 w-64 bg-purple-500 rounded-full" />
          </div>

          <div className="relative flex flex-col items-center gap-8 p-8 md:flex-row md:p-12">
            <div className="h-64 w-48 flex-shrink-0 overflow-hidden rounded-2xl border-4 border-white/10 shadow-2xl">
              <Image
                src={
                  game.thumbnail ||
                  "https://placehold.co/600x800/222/555?text=Game"
                }
                alt={game.name}
                width={300}
                height={400}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center gap-3 mb-4 md:justify-start">
                <Badge className="bg-cyan-500/20 text-cyan-400 border-none px-3 sm:px-4 py-1 text-xs sm:text-sm">
                  {game.category}
                </Badge>
                <Badge
                  variant="outline"
                  className="border-white/10 text-gray-400 text-xs sm:text-sm"
                >
                  {game.giftcodes.length} Codes
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white mb-4 italic uppercase">
                {game.name}
              </h1>
              <p className="max-w-2xl text-sm sm:text-base md:text-lg text-gray-400 mb-8">
                {game.description ||
                  `Chào mừng bạn đến với ${game.name}. Tại đây bạn có thể tìm thấy toàn bộ giftcode mới nhất và giá trị nhất.`}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
                <Button className="bg-cyan-600 hover:bg-cyan-500 text-white gap-2 rounded-xl h-10 sm:h-12 px-6 sm:px-8 font-bold text-xs sm:text-sm md:text-base">
                  <Gift className="h-4 w-4 sm:h-5 sm:w-5" />
                  NHẬN CODE NGAY
                </Button>
                <Button
                  variant="outline"
                  className="border-white/10 text-white hover:bg-white/5 gap-2 rounded-xl h-10 sm:h-12 px-6 sm:px-8 text-xs sm:text-sm md:text-base"
                >
                  <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  Chia sẻ
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Giftcodes List */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Gift className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white uppercase italic tracking-wider">
              Danh sách <span className="text-cyan-400">GIFTCODE</span>
            </h2>
          </div>

          {game.giftcodes.length > 0 ? (
            <div className="grid gap-6">
              {game.giftcodes.map((gc: Giftcode) => (
                <GiftcodeCard key={gc.id} giftcode={gc} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-white/10 p-12 text-center bg-white/5">
              <Info className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                Chưa có giftcode nào
              </h3>
              <p className="text-gray-400 text-sm sm:text-base">
                Chúng tôi đang cập nhật giftcode cho game này. Quay lại sau nhé!
              </p>
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-white/5 bg-black/50 py-12">
        <div className="container mx-auto px-4 text-center space-y-3">
          <p className="text-gray-500 text-sm">
            © 2026 GIFTCODE CENTER. All rights reserved.
          </p>
          <div className="flex items-center justify-center gap-2 text-gray-600 text-xs">
            <span>Website thuộc bản quyền của</span>
            <Image
              src="/favicon.png"
              alt="N2K Logo"
              width={60}
              height={25}
              className="inline-block"
            />
          </div>
        </div>
      </footer>
    </div>
  );
}
