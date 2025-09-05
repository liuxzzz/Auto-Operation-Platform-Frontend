import { PrismaClient } from "./generated/prisma";

// 全局声明以避免在开发环境中创建多个实例
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// 创建 Prisma 客户端实例
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query"] : [],
  });

// 在开发环境中缓存实例以避免热重载时重新创建
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// 优雅关闭连接
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});
