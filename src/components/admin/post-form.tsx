"use client";

import { createPost, updatePost } from "@/actions/blog-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Post } from "@prisma/client";
import { ChevronLeft, FileText, Link as LinkIcon, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function PostForm({ initialData }: { initialData?: Post | null }) {
  const router = useRouter();

  const handlePostAction = async (formData: FormData) => {
    try {
      let result;
      if (initialData) {
        result = await updatePost(initialData.id, formData);
        if (result.success) toast.success("Đã cập nhật bài viết!");
      } else {
        result = await createPost(formData);
        if (result.success) toast.success("Đã tạo bài viết mới!");
      }
      
      if (result.success) {
        router.push("/admin/blog");
        router.refresh();
      } else {
        toast.error(result.message || "Thao tác thất bại.");
      }
    } catch (error) {
       toast.error("Có lỗi xảy ra: " + (error as Error).message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => router.back()} 
          className="text-gray-400 hover:text-white gap-2 px-0 hover:bg-transparent"
        >
          <ChevronLeft className="h-5 w-5" /> Quay lại
        </Button>
        <h1 className="text-3xl font-bold text-cyan-400 italic">
          {initialData ? "CHỈNH SỬA BÀI VIẾT" : "SOẠN THẢO BÀI MỚI"}
        </h1>
      </div>

      <form action={handlePostAction} className="space-y-8 bg-[#0c0c0c] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-8 space-y-8">
          <div className="space-y-4">
            <div className="space-y-2">
               <Label htmlFor="post-title" className="text-gray-400 uppercase text-[10px] font-bold tracking-widest">Tiêu đề (H1)</Label>
               <Input id="post-title" name="title" defaultValue={initialData?.title} placeholder="VD: 5 Cách săn Giftcode tân thủ hiệu quả nhất..." className="bg-white/5 border-white/10 rounded-xl h-12 text-lg font-bold" required />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="post-slug" className="text-gray-400 uppercase text-[10px] font-bold tracking-widest flex items-center gap-1">
                  <LinkIcon className="h-3 w-3" /> Đường dẫn URL
                </Label>
                <Input id="post-slug" name="slug" defaultValue={initialData?.slug} placeholder="huong-dan-giftcode-2026" className="bg-white/5 border-white/10 rounded-xl h-11 italic text-cyan-400" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="post-thumbnail" className="text-gray-400 uppercase text-[10px] font-bold tracking-widest">Ảnh bìa (URL)</Label>
                <Input id="post-thumbnail" name="thumbnail" defaultValue={initialData?.thumbnail || ""} placeholder="https://..." className="bg-white/5 border-white/10 rounded-xl h-11" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="post-excerpt" className="text-gray-400 uppercase text-[10px] font-bold tracking-widest flex items-center gap-1">
                 <FileText className="h-3 w-3" /> Mô tả ngắn
              </Label>
              <textarea id="post-excerpt" name="excerpt" defaultValue={initialData?.excerpt || ""} rows={2} className="w-full bg-white/5 border border-white/10 p-4 text-sm rounded-xl outline-none focus:ring-1 focus:ring-cyan-500 transition-all font-sans" placeholder="Tóm tắt nội dung để hiện ở trang chủ blog..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="post-content" className="text-gray-400 uppercase text-[10px] font-bold tracking-widest">Nội dung chi tiết</Label>
              <textarea id="post-content" name="content" defaultValue={initialData?.content} rows={15} className="w-full bg-white/5 border border-white/10 p-4 text-base rounded-2xl outline-none focus:ring-1 focus:ring-cyan-500 transition-all font-sans leading-relaxed" placeholder="Bắt đầu viết nội dung tại đây..." required />
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-6">
            <div className="flex items-center gap-2">
               <Search className="h-4 w-4 text-cyan-400" />
               <h4 className="text-xs font-bold text-white uppercase tracking-widest">Cấu hình SEO nâng cao</h4>
            </div>
            
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle" className="text-[10px] text-gray-500 uppercase">Thẻ Meta Title</Label>
                <Input id="metaTitle" name="metaTitle" defaultValue={initialData?.metaTitle || ""} className="bg-black/20 border-white/5 rounded-lg h-10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaDescription" className="text-[10px] text-gray-500 uppercase">Thẻ Meta Description</Label>
                <textarea id="metaDescription" name="metaDescription" defaultValue={initialData?.metaDescription || ""} rows={2} className="w-full bg-black/20 border border-white/5 p-3 text-sm rounded-lg outline-none" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="keywords" className="text-[10px] text-gray-500 uppercase">Từ khóa chính</Label>
                <Input id="keywords" name="keywords" defaultValue={initialData?.keywords || ""} className="bg-black/20 border-white/5 rounded-lg h-10" placeholder="giftcode, game mobile, share code..." />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-cyan-500/5 rounded-xl border border-cyan-500/10">
            <input type="checkbox" id="post-published" name="published" value="true" defaultChecked={initialData ? initialData.published : true} className="accent-cyan-500 h-6 w-6 rounded border-white/10 cursor-pointer" />
            <Label htmlFor="post-published" className="font-bold cursor-pointer select-none">Xuất bản công khai bài viết ngay sau khi lưu</Label>
          </div>
        </div>
        
        <div className="p-8 border-t border-white/10 bg-[#0a0a0a]">
          <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold h-14 rounded-2xl shadow-xl shadow-cyan-500/20 text-lg uppercase tracking-wider transition-all hover:scale-[1.01]">
            {initialData ? "Lưu thay đổi" : "Lưu và xuất bản"}
          </Button>
        </div>
      </form>
    </div>
  );
}
