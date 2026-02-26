"use client";

import { loginAdmin } from "@/actions/auth-actions";
import { createGame, deleteGame, updateGame } from "@/actions/game-actions";
import { createGiftcode, deleteGiftcode, updateGiftcode } from "@/actions/giftcode-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Game, Giftcode } from "@prisma/client";
import { format } from "date-fns";
import { Edit, Gift, LayoutGrid, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

type GameWithCount = Game & { _count: { giftcodes: number } };
type GiftcodeWithGame = Giftcode & { game: Game };

export function AdminDashboard({ initialGames, initialGiftcodes }: { 
  initialGames: GameWithCount[], 
  initialGiftcodes: GiftcodeWithGame[] 
}) {
  const [activeTab, setActiveTab] = useState("games");
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [editingGiftcode, setEditingGiftcode] = useState<GiftcodeWithGame | null>(null);
  const [isGameDialogOpen, setIsGameDialogOpen] = useState(false);
  const [isGiftcodeDialogOpen, setIsGiftcodeDialogOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await loginAdmin(username, password);
    
    if (result.success) {
      setIsAuthenticated(true);
      toast.success("Đã đăng nhập quyền Admin!");
    } else {
      toast.error(result.message || "Mật khẩu không đúng!");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in zoom-in duration-500">
        <div className="w-full max-w-md p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex p-4 rounded-2xl bg-cyan-500/10 text-cyan-400 mb-4">
              <LayoutGrid className="h-10 w-10" />
            </div>
            <h2 className="text-3xl font-bold text-white uppercase italic">Admin Login</h2>
            <p className="text-gray-400 mt-2">Nhập mật khẩu quản trị để tiếp tục</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="admin-user">Tài khoản</Label>
              <Input 
                id="admin-user" 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-white/5 border-white/10 h-12 rounded-xl focus:ring-cyan-500"
                placeholder="Nhập tài khoản"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-pass">Mật khẩu</Label>
              <Input 
                id="admin-pass" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/5 border-white/10 h-12 rounded-xl focus:ring-cyan-500"
                placeholder="••••••••"
                required
              />
            </div>
            <Button type="submit" className="w-full h-12 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20">
              ĐĂNG NHẬP
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // Game Form Handler
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

  // Giftcode Form Handler
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

  const handleDeleteGame = async (id: string, name: string) => {
    if (confirm(`Bạn có chắc muốn xóa game "${name}"? Toàn bộ giftcode sẽ bị xóa theo.`)) {
      try {
        await deleteGame(id);
        toast.success(`Đã xóa game: ${name}`);
      } catch {
        toast.error("Xóa game thất bại.");
      }
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10 p-1 rounded-2xl !h-14 items-stretch">
          <TabsTrigger 
            value="games" 
            className="rounded-xl h-full data-[state=active]:!bg-cyan-500 data-[state=active]:!text-black data-[state=active]:!border-transparent !shadow-none gap-2 text-lg transition-all"
          >
             <LayoutGrid className="h-5 w-5" /> Games
          </TabsTrigger>
          <TabsTrigger 
            value="giftcodes" 
            className="rounded-xl h-full data-[state=active]:!bg-cyan-500 data-[state=active]:!text-black data-[state=active]:!border-transparent !shadow-none gap-2 text-lg transition-all"
          >
             <Gift className="h-5 w-5" /> Giftcodes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="games" className="mt-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white uppercase italic">Danh sách Game ({initialGames.length})</h2>
            <Dialog open={isGameDialogOpen} onOpenChange={setIsGameDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingGame(null)} className="bg-cyan-600 hover:bg-cyan-500 text-white gap-2 rounded-xl">
                   <Plus className="h-5 w-5" /> Thêm Game
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#121212] border-white/10 text-white max-w-lg rounded-3xl">
                <form action={handleGameAction}>
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-cyan-400">
                      {editingGame ? "Cập nhật Game" : "Thêm mới Game"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-8">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">Tên Game</Label>
                      <Input id="name" name="name" defaultValue={editingGame?.name} placeholder="VD: Dragon Slayer" className="col-span-3 bg-white/5 border-white/10 rounded-xl" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="slug" className="text-right">Slug URL</Label>
                      <Input id="slug" name="slug" defaultValue={editingGame?.slug || ""} placeholder="vd: dragon-slayer" className="col-span-3 bg-white/5 border-white/10 rounded-xl" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="category" className="text-right">Thể loại</Label>
                      <Input id="category" name="category" defaultValue={editingGame?.category} placeholder="RPG, MMORPG, ..." className="col-span-3 bg-white/5 border-white/10 rounded-xl" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="thumbnail" className="text-right">Ảnh Banner (URL)</Label>
                      <Input id="thumbnail" name="thumbnail" defaultValue={editingGame?.thumbnail || ""} placeholder="https://..." className="col-span-3 bg-white/5 border-white/10 rounded-xl" />
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label htmlFor="description" className="text-right pt-2">Mô tả</Label>
                      <textarea id="description" name="description" defaultValue={editingGame?.description || ""} rows={3} className="col-span-3 bg-white/5 border-white/10 p-2 text-sm rounded-xl outline-none focus:ring-1 focus:ring-cyan-500" placeholder="Mô tả game..." />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold h-12 rounded-xl">LƯU GAME</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0c0c0c] overflow-hidden">
            <Table>
              <TableHeader className="bg-white/5 font-bold uppercase text-xs">
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="w-[100px]">Ảnh</TableHead>
                  <TableHead>Tên Game</TableHead>
                  <TableHead>Thể loại</TableHead>
                  <TableHead>Giftcodes</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialGames.map((game) => (
                  <TableRow key={game.id} className="border-white/10 hover:bg-white/5 transition-colors">
                    <TableCell>
                      <Image 
                        src={game.thumbnail || "https://placehold.co/100"} 
                        alt={game.name} 
                        width={40} 
                        height={40} 
                        className="h-10 w-10 rounded-lg object-cover" 
                      />
                    </TableCell>
                    <TableCell className="font-bold text-white">{game.name}</TableCell>
                    <TableCell><Badge variant="outline" className="border-cyan-500/30 text-cyan-400">{game.category}</Badge></TableCell>
                    <TableCell className="text-gray-400 font-mono text-sm">{game._count?.giftcodes || 0} codes</TableCell>
                    <TableCell className="text-right space-x-2">
                       <Button variant="ghost" size="icon" onClick={() => { setEditingGame(game); setIsGameDialogOpen(true); }} className="hover:bg-cyan-500/10 hover:text-cyan-400 rounded-lg"><Edit className="h-4 w-4" /></Button>
                       <Button variant="ghost" size="icon" onClick={() => handleDeleteGame(game.id, game.name)} className="hover:bg-red-500/10 hover:text-red-400 rounded-lg"><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="giftcodes" className="mt-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
           {/* Similarly for Giftcodes */}
           <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white uppercase italic">Danh sách Giftcode ({initialGiftcodes.length})</h2>
            <Dialog open={isGiftcodeDialogOpen} onOpenChange={setIsGiftcodeDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingGiftcode(null)} className="bg-cyan-600 hover:bg-cyan-500 text-white gap-2 rounded-xl">
                   <Plus className="h-5 w-5" /> Thêm Code
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#121212] border-white/10 text-white max-w-lg rounded-3xl">
                <form action={handleGiftcodeAction}>
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-cyan-400">
                      {editingGiftcode ? "Cập nhật Giftcode" : "Thêm mới Giftcode"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-8">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="gameId" className="text-right">Game</Label>
                      <select id="gameId" name="gameId" defaultValue={editingGiftcode?.gameId} className="col-span-3 bg-white/5 border border-white/10 rounded-xl h-10 px-3 outline-none focus:ring-1 focus:ring-cyan-500" required>
                        <option value="" disabled className="bg-black">Chọn game...</option>
                        {initialGames.map(g => <option key={g.id} value={g.id} className="bg-black">{g.name}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="code" className="text-right">Mã Giftcode</Label>
                      <Input id="code" name="code" defaultValue={editingGiftcode?.code} placeholder="VD: QUATANTHU2026" className="col-span-3 bg-white/5 border-white/10 rounded-xl" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">Nội dung quà</Label>
                      <Input id="description" name="description" defaultValue={editingGiftcode?.description || ""} placeholder="Mô tả vật phẩm..." className="col-span-3 bg-white/5 border-white/10 rounded-xl" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="expiryDate" className="text-right">Ngày hết hạn</Label>
                      <Input id="expiryDate" name="expiryDate" type="date" defaultValue={editingGiftcode?.expiryDate ? format(new Date(editingGiftcode.expiryDate), "yyyy-MM-dd") : ""} className="col-span-3 bg-white/5 border-white/10 rounded-xl" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                       <Label className="text-right">Trạng thái</Label>
                       <div className="col-span-3 flex items-center gap-2">
                          <input type="checkbox" id="isActive" name="isActive" value="true" defaultChecked={editingGiftcode ? editingGiftcode.isActive : true} className="accent-cyan-500 h-5 w-5" />
                          <label htmlFor="isActive" className="text-sm">Đang hoạt động</label>
                       </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold h-12 rounded-xl">LƯU GIFTCODE</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0c0c0c] overflow-hidden">
            <Table>
              <TableHeader className="bg-white/5 font-bold uppercase text-xs">
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead>Game</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Hết hạn</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialGiftcodes.map((gc) => (
                  <TableRow key={gc.id} className="border-white/10 hover:bg-white/5 transition-colors">
                    <TableCell className="font-semibold text-gray-300">{gc.game?.name}</TableCell>
                    <TableCell className="font-mono text-cyan-400 font-bold">{gc.code}</TableCell>
                    <TableCell className="text-gray-400 text-sm truncate max-w-[200px]">{gc.description}</TableCell>
                    <TableCell className="text-gray-400 text-sm">{gc.expiryDate ? format(new Date(gc.expiryDate), "dd/MM/yyyy") : "Vĩnh viễn"}</TableCell>
                    <TableCell className="text-right space-x-2">
                       <Button variant="ghost" size="icon" onClick={() => { setEditingGiftcode(gc); setIsGiftcodeDialogOpen(true); }} className="hover:bg-cyan-500/10 hover:text-cyan-400 rounded-lg"><Edit className="h-4 w-4" /></Button>
                       <Button variant="ghost" size="icon" onClick={() => handleDeleteGiftcode(gc.id, gc.code)} className="hover:bg-red-500/10 hover:text-red-400 rounded-lg"><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
