import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { Calendar, User } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog Giftcode & Thủ Thuật Game | Giftcode Center",
  description:
    "Chia sẻ kinh nghiệm, thủ thuật và danh sách giftcode mới nhất cho cộng đồng game thủ.",
};

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: { username: true },
      },
    },
  });

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a]">
      <Header />

      <main className="container mx-auto flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-12">
          <div className="flex flex-col gap-2 mb-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl italic uppercase">
              Blog <span className="text-cyan-400">Game thủ</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Tin tức, thủ thuật và hướng dẫn nhận giftcode mới nhất
            </p>
          </div>

          {posts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group"
                >
                  <article className="h-full overflow-hidden rounded-2xl border border-white/10 bg-[#121212] transition-colors group-hover:border-cyan-500/50">
                    <div className="aspect-video overflow-hidden">
                      <Image
                        src={
                          post.thumbnail ||
                          "https://placehold.co/800x450/222/555?text=Blog"
                        }
                        alt={post.title}
                        width={800}
                        height={450}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-4">
                      <div className="mb-3 flex items-center gap-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(post.createdAt), "dd/MM/yyyy")}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {post.author.username}
                        </div>
                      </div>
                      <h2 className="mb-2 text-lg font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="text-xs text-gray-400 line-clamp-2">
                        {post.excerpt || post.content.substring(0, 150)}...
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <h3 className="text-xl font-bold text-white mb-2">
                Chưa có bài viết nào
              </h3>
              <p className="text-gray-400">
                Chúng tôi đang chuẩn bị nội dung hay cho bạn. Quay lại sau nhé!
              </p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
