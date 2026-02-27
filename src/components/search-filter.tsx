"use client";

import { Input } from "@/components/ui/input";
import { Search, X, ChevronDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, useEffect } from "react";

export function SearchFilter({
  categories,
  activeCategory,
}: {
  categories: readonly string[];
  activeCategory: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(searchParams.get("q") || "");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (searchValue) {
        params.set("q", searchValue);
      } else {
        params.delete("q");
      }
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    }, 300);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  const handleCategory = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category && category !== "Tất cả") {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const clearSearch = () => {
    setSearchValue("");
  };

  return (
    <div className="w-full mb-6 sm:mb-8">
      {/* Search Box & Category Select Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
        {/* Search Box */}
        <div className="relative flex-1 sm:max-w-md group">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative">
            <Search
              className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-all duration-300 ${
                isPending
                  ? "text-cyan-400 animate-pulse"
                  : "text-gray-400 group-hover:text-cyan-400 group-hover:scale-110"
              }`}
            />
            <Input
              placeholder="Tìm kiếm game..."
              className="pl-9 pr-9 bg-white/5 backdrop-blur-xl border-white/10 text-white h-10 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-sm placeholder:text-gray-500 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            {searchValue && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 group/clear"
              >
                <X className="h-3.5 w-3.5 text-gray-400 group-hover/clear:text-white" />
              </button>
            )}
          </div>
        </div>

        {/* Category Select */}
        <div className="relative w-full sm:w-48 group">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative">
            <select
              value={activeCategory}
              onChange={(e) => handleCategory(e.target.value)}
              className="w-full h-10 pl-3 pr-9 bg-white/5 backdrop-blur-xl border border-white/10 text-white rounded-xl text-sm appearance-none cursor-pointer hover:bg-white/10 hover:border-white/20 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300 font-medium"
            >
              {categories.map((cat) => (
                <option
                  key={cat}
                  value={cat}
                  className="bg-[#1a1a1a] text-white"
                >
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none transition-colors group-hover:text-cyan-400" />
          </div>
        </div>

        {/* Active Filter Info */}
        {(searchValue || activeCategory !== "Tất cả") && (
          <div className="hidden sm:flex flex-wrap items-center gap-2 text-xs text-gray-400 animate-in fade-in slide-in-from-right-2 duration-300">
            <span className="font-medium text-gray-500">Lọc:</span>
            {searchValue && (
              <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium text-[11px]">
                &ldquo;{searchValue}&rdquo;
              </span>
            )}
            {activeCategory !== "Tất cả" && (
              <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium text-[11px]">
                {activeCategory}
              </span>
            )}
            <button
              onClick={() => {
                setSearchValue("");
                handleCategory("Tất cả");
              }}
              className="text-[10px] text-gray-500 hover:text-white transition-colors underline underline-offset-2"
            >
              Xóa
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
