"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createGiftcode(formData: FormData) {
  const code = formData.get("code") as string;
  const description = formData.get("description") as string;
  const gameId = formData.get("gameId") as string;
  const expiryDateStr = formData.get("expiryDate") as string;
  const isActive = formData.get("isActive") === "true";

  const expiryDate = expiryDateStr ? new Date(expiryDateStr) : null;

  await prisma.giftcode.create({
    data: { code, description, gameId, expiryDate, isActive },
  });

  const game = await prisma.game.findUnique({
    where: { id: gameId },
    select: { slug: true }
  });

  revalidatePath("/");
  revalidatePath("/admin");
  if (game) revalidatePath(`/game/${game.slug}`);
}

export async function updateGiftcode(id: string, formData: FormData) {
  const code = formData.get("code") as string;
  const description = formData.get("description") as string;
  const gameId = formData.get("gameId") as string;
  const expiryDateStr = formData.get("expiryDate") as string;
  const isActive = formData.get("isActive") === "true";

  const expiryDate = expiryDateStr ? new Date(expiryDateStr) : null;

  await prisma.giftcode.update({
    where: { id },
    data: { code, description, gameId, expiryDate, isActive },
  });

  const game = await prisma.game.findUnique({
    where: { id: gameId },
    select: { slug: true }
  });

  revalidatePath("/");
  revalidatePath("/admin");
  if (game) revalidatePath(`/game/${game.slug}`);
}

export async function deleteGiftcode(id: string) {
  const gc = await prisma.giftcode.findUnique({ 
    where: { id },
    include: { game: true }
  });
  
  await prisma.giftcode.delete({ where: { id } });
  
  revalidatePath("/");
  revalidatePath("/admin");
  if (gc?.game) revalidatePath(`/game/${gc.game.slug}`);
}
