import { GameCard } from "@/components/game-card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SearchFilter } from "@/components/search-filter";
import { prisma } from "@/lib/prisma";
import { GAME_CATEGORIES } from "@/lib/constants";
import { Gamepad2 } from "lucide-react";

export const dynamic = "force-dynamic";

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

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a]">
      <Header />

      <main className="container mx-auto flex-1 px-4 py-6 sm:py-8 sm:px-6 lg:px-8 max-w-[1600px]">
        <section>
          {/* Hero Title Section */}
          <div className="flex flex-col gap-2 sm:gap-3 mb-6 sm:mb-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="relative inline-block">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl blur-2xl opacity-20 animate-pulse" />
              <h1 className="relative text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-white italic uppercase leading-tight">
                Danh sách{" "}
                <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
                  Game
                </span>
              </h1>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm md:text-base lg:text-lg">
              Khám phá hàng trăm game hot và nhận giftcode miễn phí mỗi ngày 🎮
            </p>
          </div>

          {/* Search & Filter Section */}
          <SearchFilter
            categories={GAME_CATEGORIES}
            activeCategory={category}
          />

          {/* Games Grid */}
          {games.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
              {games.map((game, index) => (
                <div
                  key={game.id}
                  className="animate-in fade-in slide-in-from-bottom-4"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: "backwards",
                  }}
                >
                  <GameCard game={game} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-center animate-in fade-in zoom-in duration-500">
              <div className="mb-4 sm:mb-6 rounded-full bg-gradient-to-br from-white/5 to-white/10 p-6 sm:p-8 backdrop-blur-sm border border-white/10">
                <Gamepad2 className="h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 text-gray-600" />
              </div>
              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white mb-2">
                Không tìm thấy game
              </h3>
              <p className="text-gray-400 max-w-md text-xs sm:text-sm md:text-base px-4">
                Thử tìm kiếm với từ khóa khác hoặc chọn thể loại khác phù hợp
                với bạn.
              </p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
