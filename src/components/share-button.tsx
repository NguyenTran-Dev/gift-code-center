"use client";

import { Button } from "@/components/ui/button";
import { Share2, Copy, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface ShareButtonProps {
  title: string;
  description?: string;
  url: string;
  className?: string;
}

export function ShareButton({
  title,
  description,
  url,
  className,
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description || title,
          url,
        });
        setIsOpen(false);
      } catch (err) {
        console.error("Share failed:", err);
      }
    }
  };

  const isWebShareSupported =
    typeof navigator !== "undefined" && !!navigator.share;

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  };

  return (
    <div className="relative" ref={menuRef}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className={`border-white/10 text-white hover:bg-white/5 gap-2 rounded-xl h-10 sm:h-12 px-6 sm:px-8 text-xs sm:text-sm md:text-base ${className}`}
      >
        <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
        Chia sẻ
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-[#0c0c0c] border border-white/10 rounded-2xl shadow-2xl py-2 z-50">
          {/* Web Share API option */}
          {isWebShareSupported && (
            <>
              <button
                onClick={handleWebShare}
                className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-white/5 transition-colors flex items-center gap-3"
              >
                <Share2 className="h-4 w-4 text-cyan-400" />
                Chia sẻ ngay
              </button>
              <div className="border-t border-white/5 my-1" />
            </>
          )}

          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-white/5 transition-colors flex items-center gap-3"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-green-400" />
                Đã sao chép!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-cyan-400" />
                Sao chép liên kết
              </>
            )}
          </button>

          <div className="border-t border-white/5 my-1" />

          {/* Social Media Share */}
          <a
            href={shareLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-white/5 transition-colors flex items-center gap-3"
            onClick={() => setIsOpen(false)}
          >
            <svg
              className="h-4 w-4 text-blue-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook
          </a>

          <a
            href={shareLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-white/5 transition-colors flex items-center gap-3"
            onClick={() => setIsOpen(false)}
          >
            <svg
              className="h-4 w-4 text-sky-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M23.953 4.57a10 10 0 002.856-9.976c-.868.465-1.9.836-2.974.99a5.002 5.002 0 008.6-4.537c.987.588-1.773-.289-2.78-.289A10.007 10.007 0 005.73 20.618a10.004 10.004 0 0014.223-7.05z" />
            </svg>
            Twitter
          </a>

          <a
            href={shareLinks.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-white/5 transition-colors flex items-center gap-3"
            onClick={() => setIsOpen(false)}
          >
            <svg
              className="h-4 w-4 text-sky-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.82-1.084.508l-3-2.21-1.446 1.394c-.14.14-.357.36-.748.36-.505 0-.843-.338-.843-.748v-5.528c0-.403.164-.75.361-1.017.197-.267.492-.452.887-.452h.928c.397 0 .595.253.66.566.065.313.13.626.195.94l.975 4.58c.065.313.162.626.325.94.163.314.406.471.732.471.326 0 .58-.157.77-.471.19-.314.325-.627.422-.94l1.46-6.88c.065-.313.16-.626.292-.94.132-.314.324-.471.58-.471.256 0 .402.157.423.471.022.314.02.627-.065.94l-1.462 6.88c-.128.6-.42 1.08-.876 1.44-.456.36-1.008.54-1.656.54-.584 0-1.088-.162-1.512-.486-.424-.324-.708-.794-.852-1.41-.144-.616-.108-1.283.108-2.001l.75-3.53c.065-.312.13-.625.195-.938.065-.313.163-.626.325-.94.162-.314.405-.471.731-.471.327 0 .58.157.77.471.19.314.325.627.422.94l1.46 6.88c.065.313.16.626.292.94.132.314.324.471.58.471.256 0 .402-.157.423-.471.022-.314.02-.627-.065-.94l-1.462-6.88c-.128-.6-.42-1.08-.876-1.44-.456-.36-1.008-.54-1.656-.54z" />
            </svg>
            Telegram
          </a>
        </div>
      )}
    </div>
  );
}
