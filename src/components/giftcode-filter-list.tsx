"use client";

import { Giftcode } from "@prisma/client";
import { useState, useMemo } from "react";
import { GiftcodeCard } from "./giftcode-card";
import { Info, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GiftcodeFilterListProps {
    giftcodes: Giftcode[];
}

type FilterStatus = "all" | "active" | "expired";

export function GiftcodeFilterList({ giftcodes }: GiftcodeFilterListProps) {
    const [status, setStatus] = useState<FilterStatus>("active");

    const filteredGiftcodes = useMemo(() => {
        const now = new Date();
        return giftcodes.filter((gc) => {
            const isExpired = gc.expiryDate && new Date(gc.expiryDate) < now;
            if (status === "active") return !isExpired;
            if (status === "expired") return isExpired;
            return true;
        });
    }, [giftcodes, status]);

    const activeCount = useMemo(() => {
        const now = new Date();
        return giftcodes.filter((gc) => !gc.expiryDate || new Date(gc.expiryDate) >= now).length;
    }, [giftcodes]);

    const expiredCount = useMemo(() => {
        const now = new Date();
        return giftcodes.filter((gc) => gc.expiryDate && new Date(gc.expiryDate) < now).length;
    }, [giftcodes]);

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap items-center gap-2">
                <Button
                    variant={status === "active" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatus("active")}
                    className={`rounded-full px-6 ${status === "active"
                            ? "bg-cyan-600 hover:bg-cyan-500 text-white"
                            : "border-white/10 text-gray-400 hover:text-cyan-400"
                        }`}
                >
                    Còn hạn ({activeCount})
                </Button>
                <Button
                    variant={status === "expired" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatus("expired")}
                    className={`rounded-full px-6 ${status === "expired"
                            ? "bg-orange-600 hover:bg-orange-500 text-white"
                            : "border-white/10 text-gray-400 hover:text-orange-400"
                        }`}
                >
                    Hết hạn ({expiredCount})
                </Button>
                <Button
                    variant={status === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatus("all")}
                    className={`rounded-full px-6 ${status === "all"
                            ? "bg-white/10 text-white"
                            : "border-white/10 text-gray-400 hover:text-white"
                        }`}
                >
                    Tất cả ({giftcodes.length})
                </Button>
            </div>

            {filteredGiftcodes.length > 0 ? (
                <div className="grid gap-6">
                    {filteredGiftcodes.map((gc) => (
                        <GiftcodeCard key={gc.id} giftcode={gc} />
                    ))}
                </div>
            ) : (
                <div className="rounded-3xl border border-dashed border-white/10 p-12 text-center bg-white/5">
                    <Info className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                        {status === "expired" ? "Không có code hết hạn" : "Chưa có giftcode nào"}
                    </h3>
                    <p className="text-gray-400 text-sm sm:text-base">
                        {status === "expired"
                            ? "Tất cả giftcode của game này vẫn còn hiệu lực nhé!"
                            : "Chúng tôi đang cập nhật giftcode cho game này. Quay lại sau nhé!"}
                    </p>
                </div>
            )}
        </div>
    );
}
