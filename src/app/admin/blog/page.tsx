import { PostManagement } from "@/components/admin/post-management";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PostManagement initialPosts={posts} />
    </div>
  );
}
