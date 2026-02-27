import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "mysql://root:root_password@127.0.0.1:3306/giftcode_db"
    }
  }
})

async function main() {
  try {
    const games = await prisma.game.findMany()
    console.log('Success:', games.length)
  } catch (e) {
    console.error(e)
  } finally {
    await prisma.$disconnect()
  }
}
main()
