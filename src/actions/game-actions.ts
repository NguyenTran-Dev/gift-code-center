"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createGame(formData: FormData) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string || name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
  const thumbnail = formData.get("thumbnail") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;

  await prisma.game.create({
    data: { name, slug, thumbnail, description, category },
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateGame(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const thumbnail = formData.get("thumbnail") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;

  await prisma.game.update({
    where: { id },
    data: { name, slug, thumbnail, description, category },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/game/${slug}`);
}

export async function deleteGame(id: string) {
  await prisma.game.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin");
}
