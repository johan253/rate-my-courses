/* eslint-disable no-unused-vars */
import { Prisma, PrismaClient } from "@prisma/client";

declare global {
  // This prevents TypeScript from redeclaring the prisma variable in a global context
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;