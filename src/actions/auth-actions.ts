"use server";

import { prisma } from "@/lib/prisma";

export async function loginAdmin(username: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    return { success: false, message: "Tài khoản không tồn tại!" };
  }

  // In a real app, use bcrypt.compare
  if (user.password === password) {
    return { success: true, user: { username: user.username, role: user.role } };
  }

  return { success: false, message: "Mật khẩu không đúng!" };
}
