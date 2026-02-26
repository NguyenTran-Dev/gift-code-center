import { GameCard } from "@/components/game-card";
import { Header } from "@/components/header";
import { SearchFilter } from "@/components/search-filter";
import { prisma } from "@/lib/prisma";
import { Gamepad2 } from "lucide-react";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q: query = "", category = "Tất cả" } = await searchParams;

  const games = await prisma.game.findMany({
    where: {
      AND: [
        {
          OR: [
            { name: { contains: query } },
            { description: { contains: query } },
          ],
        },
        category !== "Tất cả" ? { category } : {},
      ],
    },
    include: {
      _count: {
        select: { giftcodes: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const categories = ["Tất cả", "RPG", "FPS", "MMORPG", "Racing", "Battle Royale", "Strategy"];

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a]">
      <Header />
      
      <main className="container mx-auto flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-12">
          <div className="flex flex-col gap-2 mb-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl italic uppercase">
              Danh sách <span className="text-cyan-400">Game</span>
            </h1>
            <p className="text-gray-400 text-lg">Chọn game để xem và nhận giftcode miễn phí</p>
          </div>

          <SearchFilter categories={categories} activeCategory={category} />

          {games.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
              {games.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 rounded-full bg-white/5 p-6">
                <Gamepad2 className="h-12 w-12 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Không tìm thấy game</h3>
              <p className="text-gray-400 max-w-xs">Thử tìm kiếm với từ khóa khác hoặc quay lại sau.</p>
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-white/5 bg-black/50 py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            © 2026 GIFTCODE CENTER. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
