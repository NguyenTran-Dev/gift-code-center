import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { Calendar, ChevronLeft, User } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
  });

  if (!post) return { title: "Blog not found" };

  return {
    title: post.metaTitle || `${post.title} | Giftcode Center`,
    description: post.metaDescription || post.excerpt || post.title,
    keywords: post.keywords || "giftcode, game, blog game, thu thuat game",
    openGraph: {
      title: post.title,
      description: post.metaDescription || post.excerpt || post.title,
      images: post.thumbnail ? [post.thumbnail] : [],
      type: "article",
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: {
        select: { username: true },
      },
    },
  });

  if (!post || (!post.published && process.env.NODE_ENV === "production")) {
    notFound();
  }

  // Lấy các bài viết liên quan (3 bài gần đây nhất ngoại trừ bài hiện tại)
  const relatedPosts = await prisma.post.findMany({
    where: {
      published: true,
      NOT: {
        id: post.id,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      thumbnail: true,
      createdAt: true,
      author: {
        select: { username: true },
      },
    },
  });

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a]">
      <Header />

      <main className="container mx-auto flex-1 px-4 py-8 sm:px-6 lg:max-w-4xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-400 hover:text-cyan-400 mb-8 transition-colors group"
        >
          <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:-translate-x-1" />
          Quay lại blog
        </Link>

        <article>
          <header className="mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-6">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm md:text-base text-gray-400 border-y border-white/10 py-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                {format(new Date(post.createdAt), "dd/MM/yyyy")}
              </div>
              <div className="flex items-center gap-2">
                <User className="h-3 w-3 sm:h-4 sm:w-4" />
                Tác giả:{" "}
                <span className="text-cyan-400">{post.author.username}</span>
              </div>
            </div>
          </header>

          {post.thumbnail && (
            <div className="mb-12 overflow-hidden rounded-3xl border border-white/10 aspect-video">
              <Image
                src={post.thumbnail}
                alt={post.title}
                width={1200}
                height={675}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="blog-content prose prose-invert prose-cyan max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                h1: ({ ...props }) => (
                  <h1
                    className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 mt-8"
                    {...props}
                  />
                ),
                h2: ({ ...props }) => (
                  <h2
                    className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 mt-6"
                    {...props}
                  />
                ),
                h3: ({ ...props }) => (
                  <h3
                    className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 mt-4"
                    {...props}
                  />
                ),
                p: ({ ...props }) => (
                  <p
                    className="text-gray-300 text-base sm:text-base md:text-lg leading-relaxed mb-6"
                    {...props}
                  />
                ),
                ul: ({ ...props }) => (
                  <ul
                    className="list-disc list-inside mb-6 space-y-2 ml-2 sm:ml-0"
                    {...props}
                  />
                ),
                ol: ({ ...props }) => (
                  <ol
                    className="list-decimal list-inside mb-6 space-y-2 ml-2 sm:ml-0"
                    {...props}
                  />
                ),
                li: ({ ...props }) => (
                  <li
                    className="text-gray-300 text-base sm:text-base md:text-lg"
                    {...props}
                  />
                ),
                strong: ({ ...props }) => (
                  <strong className="text-cyan-400 font-bold" {...props} />
                ),
                em: ({ ...props }) => (
                  <em className="italic text-gray-200" {...props} />
                ),
                code: ({ ...props }) => (
                  <code
                    className="bg-black/50 text-cyan-300 px-2 py-1 rounded text-xs sm:text-sm"
                    {...props}
                  />
                ),
                pre: ({ ...props }) => (
                  <pre
                    className="bg-black/50 p-3 sm:p-4 rounded-lg mb-6 overflow-x-auto text-xs sm:text-sm"
                    {...props}
                  />
                ),
                blockquote: ({ ...props }) => (
                  <blockquote
                    className="border-l-4 border-cyan-500 pl-3 sm:pl-4 italic text-gray-400 mb-6 text-base sm:text-base md:text-lg"
                    {...props}
                  />
                ),
                a: ({ ...props }) => (
                  <a
                    className="text-cyan-400 hover:underline break-words"
                    {...props}
                  />
                ),
                table: ({ ...props }) => (
                  <table
                    className="w-full border-collapse border border-gray-600 mb-6 text-xs sm:text-sm"
                    {...props}
                  />
                ),
                th: ({ ...props }) => (
                  <th
                    className="border border-gray-600 bg-gray-800 px-2 sm:px-4 py-2 text-left"
                    {...props}
                  />
                ),
                td: ({ ...props }) => (
                  <td
                    className="border border-gray-600 px-2 sm:px-4 py-2"
                    {...props}
                  />
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </article>

        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
          <section className="mt-20 pt-12 border-t border-white/10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-8">
              Bài viết liên quan
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-cyan-400 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/20"
                >
                  {relatedPost.thumbnail && (
                    <div className="relative h-40 sm:h-48 overflow-hidden bg-gradient-to-br from-cyan-950 to-black">
                      <Image
                        src={relatedPost.thumbnail}
                        alt={relatedPost.title}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-sm sm:text-base font-bold text-white mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors">
                      {relatedPost.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400 line-clamp-2 mb-3">
                      {relatedPost.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{relatedPost.author.username}</span>
                      <span>
                        {format(new Date(relatedPost.createdAt), "dd/MM/yyyy")}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
