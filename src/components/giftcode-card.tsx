"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Giftcode } from "@prisma/client";
import { format } from "date-fns";
import { ClipboardCheck, Clock, Copy, Gift } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface GiftcodeCardProps {
  giftcode: Giftcode;
}

export function GiftcodeCard({ giftcode }: GiftcodeCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(giftcode.code);
    setCopied(true);
    toast.success("Đã copy giftcode: " + giftcode.code);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 transition-all hover:bg-white/10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
              <Gift className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-sm sm:text-base">
                {giftcode.code}
              </h4>
              <p className="text-xs sm:text-sm text-gray-400">
                {giftcode.description || "Quà tặng tân thủ"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[10px] sm:text-xs">
            {giftcode.expiryDate && (
              <div className="flex items-center gap-1.5 text-orange-400">
                <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span>
                  Hết hạn: {format(new Date(giftcode.expiryDate), "dd/MM/yyyy")}
                </span>
              </div>
            )}
            <Badge
              variant="outline"
              className="border-cyan-500/30 text-cyan-400 text-[10px] sm:text-xs"
            >
              Đang hoạt động
            </Badge>
          </div>
        </div>

        <Button
          onClick={handleCopy}
          className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-500 text-white gap-2 transition-all font-bold px-6 py-5 sm:py-2 rounded-xl text-xs sm:text-sm"
        >
          {copied ? (
            <>
              <ClipboardCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>ĐÃ COPY</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>COPY CODE</span>
            </>
          )}
        </Button>
      </div>

      <div className="absolute -right-4 -top-4 opacity-5 pointer-events-none">
        <Gift className="h-20 w-20 sm:h-24 sm:w-24 text-white" />
      </div>
    </div>
  );
}
