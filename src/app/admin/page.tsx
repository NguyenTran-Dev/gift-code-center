import { AdminDashboard } from "@/components/admin-dashboard";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const games = await prisma.game.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { giftcodes: true },
      },
    },
  });

  const giftcodes = await prisma.giftcode.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      game: true,
    },
  });

  return (
    <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white italic uppercase tracking-wider">
          Quản lý <span className="text-cyan-400">Giftcode</span>
        </h1>
        <p className="text-gray-400">Hệ thống quản trị game và giftcode</p>
      </div>

      <AdminDashboard initialGames={games} initialGiftcodes={giftcodes} />
    </main>
  );
}
