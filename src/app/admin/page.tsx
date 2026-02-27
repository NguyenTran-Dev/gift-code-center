import { prisma } from "@/lib/prisma";
import {
  Clock,
  Gamepad2,
  Gift,
  LayoutGrid,
  Newspaper,
  TrendingUp,
  Users
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [gameCount, giftcodeCount, postCount, userCount] = await Promise.all([
    prisma.game.count(),
    prisma.giftcode.count(),
    prisma.post.count(),
    prisma.user.count(),
  ]);

  const recentGiftcodes = await prisma.giftcode.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { game: true }
  });

  const stats = [
    { name: "Tổng số Game", value: gameCount, icon: Gamepad2, color: "text-cyan-400", bg: "bg-cyan-500/10" },
    { name: "Tổng Giftcode", value: giftcodeCount, icon: Gift, color: "text-purple-400", bg: "bg-purple-500/10" },
    { name: "Bài viết Blog", value: postCount, icon: Newspaper, color: "text-yellow-400", bg: "bg-yellow-500/10" },
    { name: "Quản trị viên", value: userCount, icon: Users, color: "text-green-400", bg: "bg-green-500/10" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white italic">TỔNG QUAN <span className="text-cyan-400">HỆ THỐNG</span></h1>
        <p className="text-gray-400">Xem nhanh các số liệu thống kê quan trọng của website.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="p-6 rounded-3xl border border-white/10 bg-[#0c0c0c] hover:border-white/20 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <TrendingUp className="h-4 w-4 text-gray-700 group-hover:text-cyan-500 transition-colors" />
            </div>
            <p className="text-gray-500 text-sm font-medium">{stat.name}</p>
            <h3 className="text-3xl font-bold text-white mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-[#0c0c0c] overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2">
              <Clock className="h-4 w-4 text-cyan-400" />
              Giftcode vừa cập nhật
            </h3>
          </div>
          <div className="divide-y divide-white/5">
            {recentGiftcodes.map((gc) => (
              <div key={gc.id} className="p-4 hover:bg-white/5 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-cyan-400 font-bold border border-white/10">
                    <Gift className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-white uppercase text-sm">{gc.code}</p>
                    <p className="text-xs text-gray-500">{gc.game.name}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500 italic">
                  {new Date(gc.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-cyan-500/5 p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
             <div className="absolute -top-10 -right-10 h-40 w-40 bg-cyan-500/20 rounded-full blur-3xl" />
             <div className="absolute -bottom-10 -left-10 h-40 w-40 bg-purple-500/20 rounded-full blur-3xl" />
             
             <div className="relative">
                <div className="h-20 w-20 bg-cyan-500 rounded-3xl flex items-center justify-center text-black mb-6 rotate-3 shadow-xl">
                    <LayoutGrid className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 italic">LÀM VIỆC TỐT!</h3>
                <p className="text-sm text-gray-400">Website đang hoạt động ổn định. Hãy tiếp tục cập nhật những giftcode mới nhất!</p>
             </div>
        </div>
      </div>
    </div>
  );
}
