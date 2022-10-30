import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getTest = async (name: string) => {
  return prisma.test1.findFirst({ where: { name } });
};
