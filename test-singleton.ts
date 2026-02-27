import 'dotenv/config';
import { prisma } from './src/lib/prisma';

async function main() {
  try {
    console.log('Attempting to connect to database...');
    const games = await prisma.game.findMany({ take: 1 });
    console.log('Success! Found games:', games.length);
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
