"use client";

import { deletePost } from "@/actions/blog-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Post } from "@prisma/client";
import { format } from "date-fns";
import {
  Edit,
  Eye,
  FileText,
  Link as LinkIcon,
  Newspaper,
  Plus,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export function PostManagement({ initialPosts }: { initialPosts: Post[] }) {
  const handleDeletePost = async (id: string, title: string) => {
    if (confirm(`Bạn có chắc muốn xóa bài viết "${title}"?`)) {
      try {
        const result = await deletePost(id);
        if (result.success) {
          toast.success(`Đã xóa bài viết: ${title}`);
        } else {
          toast.error(result.message || "Xóa bài viết thất bại.");
        }
      } catch {
        toast.error("Xóa bài viết thất bại.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white uppercase italic flex items-center gap-2">
            <Newspaper className="h-6 w-6 text-cyan-400" />
            Quản lý Blog
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Viết bài và tối ưu SEO cho blog ({initialPosts.length} bài viết)
          </p>
        </div>
        <Link href="/admin/blog/new">
          <Button className="bg-cyan-600 hover:bg-cyan-500 text-white gap-2 rounded-xl h-11 px-6 shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95">
            <Plus className="h-5 w-5" /> Soạn bài mới
          </Button>
        </Link>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0c0c0c] overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="h-14 font-bold text-gray-300 uppercase text-[10px] tracking-widest">
                Bài viết
              </TableHead>
              <TableHead className="h-14 font-bold text-gray-300 uppercase text-[10px] tracking-widest">
                Dẫn hướng
              </TableHead>
              <TableHead className="h-14 font-bold text-gray-300 uppercase text-[10px] tracking-widest">
                Cập nhật
              </TableHead>
              <TableHead className="h-14 font-bold text-gray-300 uppercase text-[10px] tracking-widest">
                Trạng thái
              </TableHead>
              <TableHead className="h-14 font-bold text-gray-300 uppercase text-[10px] tracking-widest text-right px-6">
                Thao tác
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialPosts.length > 0 ? (
              initialPosts.map((post) => (
                <TableRow
                  key={post.id}
                  className="border-white/10 hover:bg-white/5 transition-colors group"
                >
                  <TableCell className="max-w-[300px]">
                    <div className="flex flex-col gap-1 py-1">
                      <span className="font-bold text-white truncate text-base group-hover:text-cyan-400 transition-colors">
                        {post.title}
                      </span>
                      <span className="text-xs text-gray-500 line-clamp-1 italic">
                        {post.excerpt || "Không có đoạn trích..."}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-cyan-400/80 font-mono text-xs">
                      <LinkIcon className="h-3 w-3" />
                      <span className="italic">{post.slug}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-400 text-sm">
                    {format(new Date(post.updatedAt), "HH:mm, dd/MM/yy")}
                  </TableCell>
                  <TableCell>
                    {post.published ? (
                      <Badge className="bg-green-500/10 text-green-400 border border-green-500/20 rounded-full px-3 py-1 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1 w-fit">
                        <Eye className="h-3 w-3" /> Đã công khai
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full px-3 py-1 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1 w-fit">
                        <FileText className="h-3 w-3" /> Bản nháp
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right px-6 space-x-1">
                    <Link href={`/admin/blog/${post.id}/edit`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 hover:bg-cyan-500/10 hover:text-cyan-400 rounded-lg group-hover:scale-110 transition-transform"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeletePost(post.id, post.title)}
                      className="h-9 w-9 hover:bg-red-500/10 hover:text-red-400 rounded-lg group-hover:scale-110 transition-transform"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="border-white/10">
                <TableCell
                  colSpan={5}
                  className="h-32 text-center text-gray-500 italic"
                >
                  Chưa có bài viết blog nào...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
