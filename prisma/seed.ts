import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

async function main() {
    const dbUrl = new URL(process.env.DATABASE_URL!);
    const adapter = new PrismaMariaDb({
        host: dbUrl.hostname,
        port: parseInt(dbUrl.port) || 3306,
        user: dbUrl.username,
        password: dbUrl.password,
        database: dbUrl.pathname.substring(1),
        allowPublicKeyRetrieval: true,
    });

    const prisma = new PrismaClient({ adapter });

    console.log("��� Seeding database...");

    // Seed Admin User
    console.log("��� Creating admin user...");
    const adminPassword = "ZRo_PfbIMaol9Ub?re@_Pcda";
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const adminUser = await prisma.user.upsert({
        where: { username: "admin" },
        update: {
            password: hashedPassword,
        },
        create: {
            username: "admin",
            password: hashedPassword,
            role: "ADMIN",
        },
    });

    console.log("✅ Admin user created successfully!");
    console.log(`   Username: ${adminUser.username}`);

    await prisma.$disconnect();
    console.log("✨ Seeding finished!");
}

main().catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
});