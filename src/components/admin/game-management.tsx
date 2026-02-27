"use client";

import { createGame, deleteGame, updateGame } from "@/actions/game-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GAME_CATEGORIES_FOR_FORM } from "@/lib/constants";
import { Game } from "@prisma/client";
import { Edit, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

type GameWithCount = Game & { _count?: { giftcodes: number } };

export function GameManagement({
  initialGames,
}: {
  initialGames: GameWithCount[];
}) {
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [isGameDialogOpen, setIsGameDialogOpen] = useState(false);

  const handleGameAction = async (formData: FormData) => {
    try {
      if (editingGame) {
        await updateGame(editingGame.id, formData);
        toast.success("Đã cập nhật game!");
      } else {
        await createGame(formData);
        toast.success("Đã tạo game mới!");
      }
      setIsGameDialogOpen(false);
      setEditingGame(null);
    } catch (error) {
      toast.error("Có lỗi xảy ra: " + (error as Error).message);
    }
  };

  const handleDeleteGame = async (id: string, name: string) => {
    if (
      confirm(
        `Bạn có chắc muốn xóa game "${name}"? Toàn bộ giftcode sẽ bị xóa theo.`,
      )
    ) {
      try {
        await deleteGame(id);
        toast.success(`Đã xóa game: ${name}`);
      } catch {
        toast.error("Xóa game thất bại.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white uppercase italic">
            Quản lý Game
          </h2>
          <p className="text-gray-400 text-sm">
            Danh sách các game đang hoạt động trên hệ thống (
            {initialGames.length})
          </p>
        </div>
        <Dialog open={isGameDialogOpen} onOpenChange={setIsGameDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setEditingGame(null)}
              className="bg-cyan-600 hover:bg-cyan-500 text-white gap-2 rounded-xl h-11 px-6 shadow-lg shadow-cyan-500/20 transition-all"
            >
              <Plus className="h-5 w-5" /> Thêm Game mới
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#121212] border-white/10 text-white max-w-lg rounded-3xl">
            <form action={handleGameAction}>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-cyan-400">
                  {editingGame ? "Cập nhật Game" : "Thêm mới Game"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-6 py-8">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên Game</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={editingGame?.name}
                    placeholder="VD: Dragon Slayer"
                    className="bg-white/5 border-white/10 rounded-xl h-11"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug URL</Label>
                    <Input
                      id="slug"
                      name="slug"
                      defaultValue={editingGame?.slug || ""}
                      placeholder="dragon-slayer"
                      className="bg-white/5 border-white/10 rounded-xl h-11"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Thể loại</Label>
                    <select
                      id="category"
                      name="category"
                      defaultValue={editingGame?.category || ""}
                      className="w-full bg-white/5 border border-white/10 text-white p-3 rounded-xl h-11 outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                      required
                    >
                      <option value="" disabled className="bg-[#1a1a1a]">
                        Chọn thể loại
                      </option>
                      {GAME_CATEGORIES_FOR_FORM.map((cat) => (
                        <option key={cat} value={cat} className="bg-[#1a1a1a]">
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="thumbnail">Ảnh Banner (URL)</Label>
                  <Input
                    id="thumbnail"
                    name="thumbnail"
                    defaultValue={editingGame?.thumbnail || ""}
                    placeholder="https://..."
                    className="bg-white/5 border-white/10 rounded-xl h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <textarea
                    id="description"
                    name="description"
                    defaultValue={editingGame?.description || ""}
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 p-3 text-sm rounded-xl outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                    placeholder="Mô tả game..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold h-12 rounded-xl shadow-lg shadow-cyan-500/20"
                >
                  LƯU THAY ĐỔI
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0c0c0c] overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="w-[80px] h-14">Ảnh</TableHead>
              <TableHead className="h-14">Tên Game</TableHead>
              <TableHead className="h-14">Thể loại</TableHead>
              <TableHead className="h-14">Giftcodes</TableHead>
              <TableHead className="h-14 text-right px-6">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialGames.length > 0 ? (
              initialGames.map((game) => (
                <TableRow
                  key={game.id}
                  className="border-white/10 hover:bg-white/5 transition-colors group"
                >
                  <TableCell className="py-4">
                    <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-white/10">
                      <Image
                        src={game.thumbnail || "https://placehold.co/100"}
                        alt={game.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-white">
                    <div className="flex flex-col">
                      <span>{game.name}</span>
                      <span className="text-[10px] text-gray-500 font-mono tracking-tighter uppercase">
                        {game.slug}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="border-cyan-500/30 text-cyan-400 bg-cyan-500/5 px-3 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider"
                    >
                      {game.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
                      <span className="text-gray-400 font-mono text-sm">
                        {game._count?.giftcodes || 0} codes
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right px-6 space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingGame(game);
                        setIsGameDialogOpen(true);
                      }}
                      className="h-9 w-9 hover:bg-cyan-500/10 hover:text-cyan-400 rounded-lg group-hover:scale-105 transition-transform"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteGame(game.id, game.name)}
                      className="h-9 w-9 hover:bg-red-500/10 hover:text-red-400 rounded-lg group-hover:scale-105 transition-transform"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="border-white/10">
                <TableCell
                  colSpan={5}
                  className="h-32 text-center text-gray-500 italic"
                >
                  Chưa có dữ liệu game nào...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
