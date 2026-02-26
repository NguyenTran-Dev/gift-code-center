import { prisma } from "./src/lib/prisma";

async function test() {
  try {
    console.log("Testing prisma.user...");
    console.log("Prisma keys:", Object.keys(prisma));
    // @ts-ignore
    console.log("Prisma.user:", prisma.user);
    if (prisma.user) {
      console.log("✅ prisma.user is defined!");
    } else {
      console.log("❌ prisma.user is UNDEFINED!");
    }
  } catch (e) {
    console.error("Error during test:", e);
  } finally {
    // @ts-ignore
    await prisma.$disconnect();
  }
}

test();
