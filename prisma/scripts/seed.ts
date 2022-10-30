import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seed() {
  await prisma.test1.create({
    data: {
      name: "test",
      test2: { create: { name: "test2" } },
    },
  });
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
