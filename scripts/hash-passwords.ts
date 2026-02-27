import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function hashExistingPasswords() {
  try {
    // Lấy tất cả users
    const users = await prisma.user.findMany();

    for (const user of users) {
      // Kiểm tra nếu password đã được hash chưa (bcrypt hash bắt đầu với $2a$ hoặc $2b$)
      if (
        user.password.startsWith("$2a$") ||
        user.password.startsWith("$2b$")
      ) {
        console.log(
          `User ${user.username} already has hashed password, skipping...`,
        );
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(user.password, 10);

      // Update database
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });
    }
  } catch (error) {
    console.error("Error hashing passwords:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Chạy script
hashExistingPasswords();
