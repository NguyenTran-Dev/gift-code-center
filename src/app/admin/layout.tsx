import { Header } from "@/components/header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a]">
      <Header />
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
