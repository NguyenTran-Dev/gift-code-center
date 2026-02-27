"use client";

import { loginAdmin } from "@/actions/auth-actions";
import { NavSidebar } from "@/components/admin/nav-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LayoutGrid } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authStatus = localStorage.getItem("admin_auth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await loginAdmin(username, password);
    
    if (result.success) {
      setIsAuthenticated(true);
      localStorage.setItem("admin_auth", "true");
      toast.success("Đã đăng nhập quyền Admin!");
    } else {
      toast.error(result.message || "Tài khoản hoặc mật khẩu không đúng!");
    }
  };

  if (isLoading) return null;

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] p-4">
        <div className="w-full max-w-md p-8 rounded-3xl border border-white/10 bg-[#121212] backdrop-blur-xl shadow-2xl animate-in fade-in zoom-in duration-500">
          <div className="text-center mb-8">
            <div className="inline-flex p-4 rounded-2xl bg-cyan-500/10 text-cyan-400 mb-4">
              <LayoutGrid className="h-10 w-10" />
            </div>
            <h2 className="text-3xl font-bold text-white uppercase italic">Admin <span className="text-cyan-400">Login</span></h2>
            <p className="text-gray-400 mt-2">Truy cập vào bảng điều khiển quản trị</p>
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
              ĐĂNG NHẬP HỆ THỐNG
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white">
      <NavSidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-[#0c0c0c]">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 italic">Bảng điều khiển <span className="text-cyan-400">Hệ thống</span></h2>
          <div className="flex items-center gap-4">
             <div className="h-8 w-[1px] bg-white/10 mx-2" />
             <Button 
               variant="ghost" 
               className="text-gray-400 hover:text-white"
               onClick={() => {
                 localStorage.removeItem("admin_auth");
                 setIsAuthenticated(false);
               }}
             >
               Đăng xuất
             </Button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8 bg-[#0a0a0a]">
          <div className="container mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
