import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@prisma/client';

async function main() {
  const dbUrl = new URL(process.env.DATABASE_URL!);
  const adapter = new PrismaMariaDb({
    host: dbUrl.hostname,
    port: parseInt(dbUrl.port) || 3306,
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.substring(1),
  });
  
  const prisma = new PrismaClient({ adapter });

  console.log('Seeding with PrismaMariaDb directly using config object...');

  const games = [
    {
      name: "Dragon Slayer Online",
      slug: "dragon-slayer-online",
      category: "RPG",
      thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800",
      description: "Hành trình tiêu diệt rồng trong thế giới mở kỳ ảo.",
      giftcodes: {
        create: [
          { code: "DRAGON2026", description: "100 Kim Cương + 10 Vé Quay", isActive: true },
          { code: "SLAYERFREE", description: "Trang bị bậc S ngẫu nhiên", isActive: true },
          { code: "OPENBETA", description: "Cánh Ánh Sáng vĩnh viễn", isActive: true },
        ]
      }
    },
    {
       name: "Cyber Strike",
       slug: "cyber-strike",
       category: "FPS",
       thumbnail: "https://images.unsplash.com/photo-1552824236-07764a663af3?auto=format&fit=crop&q=80&w=800",
       description: "Battlefield bối cảnh tương lai với vũ khí tối tân.",
       giftcodes: {
         create: [
           { code: "CYBER2026", description: "Skin súng M4A1 Neon", isActive: true },
           { code: "STRIKEFIRST", description: "Băng đạn mở rộng + 5000 Vàng", isActive: true },
         ]
       }
     }
  ];

  for (const game of games) {
    await prisma.game.upsert({
      where: { slug: game.slug },
      update: {},
      create: game,
    });
  }

  console.log('Seeding finished.');

  // Seed Admin User
  console.log('Seeding admin user...');
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: 'admin_password', // Should be hashed in real apps
      role: 'ADMIN',
    },
  });
  console.log('Admin user seeded.');

  await prisma.$disconnect();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
