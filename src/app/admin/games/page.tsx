import { GameManagement } from "@/components/admin/game-management";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminGamesPage() {
  const games = await prisma.game.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { giftcodes: true },
      },
    },
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <GameManagement initialGames={games} />
    </div>
  );
}
