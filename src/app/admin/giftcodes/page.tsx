import { GiftcodeManagement } from "@/components/admin/giftcode-management";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminGiftcodesPage() {
  const [giftcodes, games] = await Promise.all([
    prisma.giftcode.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        game: true,
      },
    }),
    prisma.game.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <GiftcodeManagement initialGiftcodes={giftcodes} allGames={games} />
    </div>
  );
}
