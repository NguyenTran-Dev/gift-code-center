"use server";

import { prisma } from "@/lib/prisma";
import {
  createToken,
  setAuthCookie,
  clearAuthCookie,
  getCurrentUser,
} from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function loginAdmin(username: string, password: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return { success: false, message: "Tài khoản không tồn tại!" };
    }

    // Verify password with bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { success: false, message: "Mật khẩu không đúng!" };
    }

    // Create JWT token
    const token = await createToken({
      userId: user.id,
      username: user.username,
      role: user.role,
    });

    // Set httpOnly cookie
    await setAuthCookie(token);

    return {
      success: true,
      user: {
        username: user.username,
        role: user.role,
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "Đã xảy ra lỗi khi đăng nhập!" };
  }
}

export async function logoutAdmin() {
  try {
    await clearAuthCookie();
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, message: "Đã xảy ra lỗi khi đăng xuất!" };
  }
}

export async function checkAuth() {
  try {
    const user = await getCurrentUser();
    if (user) {
      return { success: true, user };
    }
    return { success: false };
  } catch (error) {
    return { success: false };
  }
}
