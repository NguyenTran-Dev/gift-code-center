"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export function SearchFilter({ categories, activeCategory }: { categories: string[], activeCategory: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

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

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
      <div className="relative w-full max-w-md group">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${isPending ? "text-cyan-500 animate-pulse" : "text-gray-400 group-hover:text-cyan-400"}`} />
        <Input
          placeholder="Tìm kiếm game..."
          className="pl-10 bg-white/5 border-white/10 text-white h-12 rounded-xl focus:ring-cyan-500/50"
          defaultValue={searchParams.get("q")?.toString()}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Button
            key={cat}
            onClick={() => handleCategory(cat)}
            variant={activeCategory === cat ? "default" : "outline"}
            className={`rounded-xl px-6 h-10 font-medium transition-all ${
              activeCategory === cat
                ? "bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_20px_rgba(6,182,212,0.5)]"
                : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            {cat}
          </Button>
        ))}
      </div>
    </div>
  );
}
