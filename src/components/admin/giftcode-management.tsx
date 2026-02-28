"use client";

import { createGiftcode, deleteGiftcode, updateGiftcode } from "@/actions/giftcode-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Game, Giftcode } from "@prisma/client";
import { format } from "date-fns";
import { Calendar, Edit, Hash, Plus, Trash2, Type, ChevronRight, Gamepad2, Gift } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import Image from "next/image";

type GiftcodeWithGame = Giftcode & { game: Game };

export function GiftcodeManagement({
  initialGiftcodes,
  allGames
}: {
  initialGiftcodes: GiftcodeWithGame[],
  allGames: Game[]
}) {
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [editingGiftcode, setEditingGiftcode] = useState<GiftcodeWithGame | null>(null);
  const [isGiftcodeDialogOpen, setIsGiftcodeDialogOpen] = useState(false);

  const selectedGame = useMemo(() =>
    allGames.find(g => g.id === selectedGameId),
    [allGames, selectedGameId]
  );

  const filteredGiftcodes = useMemo(() => {
    if (!selectedGameId) return [];
    return initialGiftcodes.filter(gc => gc.gameId === selectedGameId);
  }, [initialGiftcodes, selectedGameId]);

  const handleGiftcodeAction = async (formData: FormData) => {
    try {
      if (editingGiftcode) {
        await updateGiftcode(editingGiftcode.id, formData);
        toast.success("Đã cập nhật giftcode!");
      } else {
        await createGiftcode(formData);
        toast.success("Đã tạo giftcode mới!");
      }
      setIsGiftcodeDialogOpen(false);
      setEditingGiftcode(null);
    } catch (error) {
      toast.error("Có lỗi xảy ra: " + (error as Error).message);
    }
  };

  const handleDeleteGiftcode = async (id: string, code: string) => {
    if (confirm(`Bạn có chắc muốn xóa giftcode "${code}"?`)) {
      try {
        await deleteGiftcode(id);
        toast.success(`Đã xóa giftcode: ${code}`);
      } catch {
        toast.error("Xóa giftcode thất bại.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white uppercase italic">Quản lý Giftcode</h2>
          <p className="text-gray-400 text-sm">
            {selectedGame
              ? `Tất cả mã quà tặng cho game: ${selectedGame.name}`
              : "Chọn một game để quản lý giftcode"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {selectedGameId && (
            <Button
              variant="outline"
              onClick={() => setSelectedGameId(null)}
              className="border-white/10 text-gray-400 hover:text-white rounded-xl"
            >
              Quay lại danh sách game
            </Button>
          )}

          <Dialog open={isGiftcodeDialogOpen} onOpenChange={setIsGiftcodeDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingGiftcode(null)} className="bg-cyan-600 hover:bg-cyan-500 text-white gap-2 rounded-xl h-11 px-6 shadow-lg shadow-cyan-500/20 transition-all">
                <Plus className="h-5 w-5" /> Phát mã mới
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#121212] border-white/10 text-white max-w-lg rounded-3xl shadow-2xl">
              <form action={handleGiftcodeAction}>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-cyan-400">
                    {editingGiftcode ? "Cập nhật Giftcode" : "Tạo Giftcode mới"}
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-6 py-8">
                  <div className="space-y-2">
                    <Label>Thuộc Game</Label>
                    {selectedGameId || editingGiftcode ? (
                      <div className="relative">
                        <div className="w-full bg-white/5 border border-white/10 rounded-xl h-11 px-4 flex items-center text-cyan-400 font-bold italic">
                          <Gamepad2 className="h-4 w-4 mr-2 text-cyan-500/50" />
                          {allGames.find((g) => g.id === (editingGiftcode?.gameId || selectedGameId))?.name}
                        </div>
                        <input type="hidden" name="gameId" value={editingGiftcode?.gameId || selectedGameId || ""} />
                      </div>
                    ) : (
                      <select
                        id="gameId"
                        name="gameId"
                        defaultValue=""
                        className="w-full bg-white/5 border border-white/10 rounded-xl h-11 px-4 outline-none focus:ring-1 focus:ring-cyan-500 transition-all appearance-none"
                        required
                      >
                        <option value="" disabled className="bg-black">
                          Chọn game mục tiêu...
                        </option>
                        {allGames.map((g) => (
                          <option key={g.id} value={g.id} className="bg-black">
                            {g.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="code" className="flex items-center gap-2 italic">
                      <Hash className="h-4 w-4 text-cyan-400" /> Mã Giftcode
                    </Label>
                    <Input id="code" name="code" defaultValue={editingGiftcode?.code} placeholder="VD: TANTHU888" className="bg-white/5 border-white/10 rounded-xl h-11 uppercase font-mono font-bold text-cyan-400" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="flex items-center gap-2 italic">
                      <Type className="h-4 w-4 text-cyan-400" /> Nội dung quà tặng
                    </Label>
                    <Input id="description" name="description" defaultValue={editingGiftcode?.description || ""} placeholder="VD: 50.000 Vàng, 20 Kim cương" className="bg-white/5 border-white/10 rounded-xl h-11" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate" className="flex items-center gap-2 italic">
                        <Calendar className="h-4 w-4 text-cyan-400" /> Ngày hết hạn
                      </Label>
                      <Input id="expiryDate" name="expiryDate" type="date" defaultValue={editingGiftcode?.expiryDate ? format(new Date(editingGiftcode.expiryDate), "yyyy-MM-dd") : ""} className="bg-white/5 border-white/10 rounded-xl h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label className="italic">Trạng thái</Label>
                      <div className="flex items-center h-11 gap-3 px-4 rounded-xl bg-white/5 border border-white/10">
                        <input type="checkbox" id="isActive" name="isActive" value="true" defaultChecked={editingGiftcode ? editingGiftcode.isActive : true} className="accent-cyan-500 h-5 w-5 rounded border-white/10" />
                        <label htmlFor="isActive" className="text-sm font-medium cursor-pointer">Hoạt động</label>
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold h-12 rounded-xl shadow-lg shadow-cyan-500/20">XÁC NHẬN PHÁT MÃ</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {!selectedGameId ? (
        /* Game List Selection View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {allGames.map((game) => {
            const count = initialGiftcodes.filter(gc => gc.gameId === game.id).length;
            return (
              <div
                key={game.id}
                onClick={() => setSelectedGameId(game.id)}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0c] p-4 cursor-pointer hover:bg-white/5 hover:border-cyan-500/50 transition-all animate-in fade-in zoom-in-95"
              >
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-white/5 border border-white/10">
                    {game.thumbnail ? (
                      <Image
                        src={game.thumbnail}
                        alt={game.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Gamepad2 className="h-6 w-6 text-gray-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white truncate group-hover:text-cyan-400 transition-colors uppercase italic text-sm">
                      {game.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Gift className="h-3.5 w-3.5 text-cyan-400" />
                      <span className="text-xs text-gray-400">
                        {count} Codes
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                </div>

                {/* Accent line */}
                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-cyan-500 group-hover:w-full transition-all duration-300" />
              </div>
            );
          })}
        </div>
      ) : (
        /* Detailed Giftcode List for Selected Game */
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="rounded-2xl border border-white/10 bg-[#0c0c0c] overflow-hidden shadow-2xl">
            <div className="p-4 bg-white/5 border-bottom border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded bg-white/5 border border-white/10 relative">
                  {selectedGame?.thumbnail && (
                    <Image src={selectedGame.thumbnail} alt={selectedGame.name} fill className="object-cover" />
                  )}
                </div>
                <h3 className="font-bold text-white uppercase italic text-lg">
                  {selectedGame?.name}
                </h3>
              </div>
              <Badge className="bg-cyan-500/20 text-cyan-400 border-none rounded-full px-4">
                {filteredGiftcodes.length} Codes
              </Badge>
            </div>
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="h-14">Mã Code</TableHead>
                  <TableHead className="h-14">Phần quà</TableHead>
                  <TableHead className="h-14">Hạn dùng</TableHead>
                  <TableHead className="h-14">Trạng thái</TableHead>
                  <TableHead className="h-14 text-right px-6">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGiftcodes.length > 0 ? (
                  filteredGiftcodes.map((gc) => (
                    <TableRow key={gc.id} className="border-white/10 hover:bg-white/5 transition-colors group">
                      <TableCell>
                        <span className="font-mono text-cyan-400 font-bold bg-cyan-500/5 px-2 py-1 rounded border border-cyan-500/10">
                          {gc.code}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-400 text-sm max-w-[300px] truncate">
                        {gc.description}
                      </TableCell>
                      <TableCell className="text-gray-400 font-mono text-sm italic">
                        {gc.expiryDate ? format(new Date(gc.expiryDate), "dd/MM/yyyy") : "Vĩnh viễn"}
                      </TableCell>
                      <TableCell>
                        {gc.isActive ? (
                          <Badge className="bg-green-500/10 text-green-400 border-none rounded-full px-3 py-0.5 text-[10px] uppercase font-bold tracking-wider">Hiệu lực</Badge>
                        ) : (
                          <Badge className="bg-red-500/10 text-red-400 border-none rounded-full px-3 py-0.5 text-[10px] uppercase font-bold tracking-wider">Hết hạn</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right px-6 space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => { setEditingGiftcode(gc); setIsGiftcodeDialogOpen(true); }} className="h-9 w-9 hover:bg-cyan-500/10 hover:text-cyan-400 rounded-lg transition-all group-hover:scale-110"><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteGiftcode(gc.id, gc.code)} className="h-9 w-9 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-all group-hover:scale-110"><Trash2 className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="border-white/10">
                    <TableCell colSpan={5} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center gap-4">
                        <Gift className="h-12 w-12 text-gray-700" />
                        <p className="text-gray-500 italic">Game này hiện chưa có giftcode nào...</p>
                        <Button
                          onClick={() => setIsGiftcodeDialogOpen(true)}
                          className="bg-white/5 text-cyan-400 hover:bg-cyan-500/10 border border-cyan-500/20 rounded-xl"
                        >
                          Phát mã ngay
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
