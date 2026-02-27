"use client";

import { cn } from "@/lib/utils";
import {
    ChevronLeft,
    ChevronRight,
    Gamepad2,
    Gift,
    LayoutDashboard,
    LogOut,
    Newspaper,
    User
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const menuItems = [
  { name: "Tổng quan", href: "/admin", icon: LayoutDashboard },
  { name: "Quản lý Game", href: "/admin/games", icon: Gamepad2 },
  { name: "Quản lý Giftcode", href: "/admin/giftcodes", icon: Gift },
  { name: "Quản lý Blog", href: "/admin/blog", icon: Newspaper },
];

export function NavSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div 
      className={cn(
        "relative flex flex-col border-r border-white/10 bg-[#0c0c0c] transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-16 items-center border-b border-white/10 px-6">
        <Link href="/" className="flex items-center gap-2 overflow-hidden">
          <div className="flex-shrink-0 p-1.5 rounded-lg bg-cyan-500 text-black">
            <Gift className="h-5 w-5" />
          </div>
          {!isCollapsed && (
            <span className="text-lg font-bold text-white uppercase italic tracking-tighter whitespace-nowrap">
              Admin <span className="text-cyan-400">Panel</span>
            </span>
          )}
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
                isActive 
                  ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "" : "group-hover:scale-110 transition-transform")} />
              {!isCollapsed && <span className="font-medium">{item.name}</span>}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-white/10">
        <div className={cn(
          "flex items-center gap-3 p-3 rounded-xl bg-white/5",
          isCollapsed ? "justify-center" : ""
        )}>
          <div className="h-8 w-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">
            <User className="h-4 w-4" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-white truncate">Administrator</p>
              <p className="text-xs text-gray-500 truncate">admin@system.io</p>
            </div>
          )}
          {!isCollapsed && (
            <button className="text-gray-500 hover:text-red-400 transition-colors">
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500 text-black border-2 border-[#0a0a0a] hover:scale-110 transition-transform shadow-lg"
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </div>
  );
}
