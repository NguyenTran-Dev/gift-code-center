import type { Metadata } from "next";
import { getBaseUrl } from "@/lib/seo";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Giftcode Center - Tổng hợp giftcode game mới nhất",
  description:
    "Trang web tổng hợp giftcode cho từng game. Cập nhật liên tục, copy nhanh chóng.",
  keywords: [
    "giftcode",
    "giftcode game",
    "code game",
    "gift code",
    "giftcode free",
    "giftcode moi nhat",
    "giftcode hom nay",
    "giftcode mien phi",
    "giftcode mobile",
    "code mobile",
    "game mobile",
    "game online",
    "game hot",
    "game nhap vai",
    "game chien thuat",
    "game hanh dong",
    "game FPS",
    "game RPG",
    "game MMORPG",
    "thu thuat game",
    "blog game",
    "tin tuc game",
    "giftcode center",
    "giftcode viet nam",
    "code game moi",
  ],
  authors: [{ name: "n2k" }],
  creator: "n2k",
  publisher: "Giftcode Center",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Giftcode Center - Tổng hợp giftcode game mới nhất",
    description:
      "Trang web tổng hợp giftcode cho từng game. Cập nhật liên tục, copy nhanh chóng.",
    url: "/",
    siteName: "Giftcode Center",
    locale: "vi_VN",
    type: "website",
    images: ["/favicon.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Giftcode Center - Tổng hợp giftcode game mới nhất",
    description:
      "Trang web tổng hợp giftcode cho từng game. Cập nhật liên tục, copy nhanh chóng.",
    images: ["/favicon.png"],
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark" style={{ colorScheme: "dark" }}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0a0a] text-foreground min-h-screen`}
      >
        <div className="relative flex min-h-screen flex-col">{children}</div>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
