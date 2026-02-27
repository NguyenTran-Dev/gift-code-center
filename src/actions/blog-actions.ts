"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createPost(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const content = formData.get("content") as string;
    const excerpt = formData.get("excerpt") as string;
    const thumbnail = formData.get("thumbnail") as string;
    const published = formData.get("published") === "true";
    const metaTitle = formData.get("metaTitle") as string;
    const metaDescription = formData.get("metaDescription") as string;
    const keywords = formData.get("keywords") as string;

    // Get an admin user for the authorId (since we don't have a session system yet)
    const admin = await prisma.user.findFirst({
      where: { role: "ADMIN" }
    });

    if (!admin) {
      throw new Error("Không tìm thấy tài khoản admin để gán tác giả");
    }

    await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        thumbnail,
        published,
        metaTitle,
        metaDescription,
        keywords,
        authorId: admin.id,
      },
    });

    revalidatePath("/blog");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Create post error:", error);
    return { success: false, message: (error as Error).message };
  }
}

export async function updatePost(id: string, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const content = formData.get("content") as string;
    const excerpt = formData.get("excerpt") as string;
    const thumbnail = formData.get("thumbnail") as string;
    const published = formData.get("published") === "true";
    const metaTitle = formData.get("metaTitle") as string;
    const metaDescription = formData.get("metaDescription") as string;
    const keywords = formData.get("keywords") as string;

    await prisma.post.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        excerpt,
        thumbnail,
        published,
        metaTitle,
        metaDescription,
        keywords,
      },
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Update post error:", error);
    return { success: false, message: (error as Error).message };
  }
}

export async function deletePost(id: string) {
  try {
    await prisma.post.delete({
      where: { id },
    });

    revalidatePath("/blog");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Delete post error:", error);
    return { success: false, message: (error as Error).message };
  }
}
