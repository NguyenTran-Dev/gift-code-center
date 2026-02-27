import { prisma } from './src/lib/prisma';

async function main() {
  try {
    const games = await prisma.game.findMany()
    console.log('Successfully connected and fetched games:', games.length)
  } catch (error) {
    console.error('Failed to connect to database:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
