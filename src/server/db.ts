import { PrismaClient } from "@prisma/client";
import { paginate } from "prisma-extension-pagination";

import { env } from "@/env.mjs";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  }).$extends({
    model: {
      patient:{
        paginate
      }
    },
  });

export const boostedPrisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  }).$extends({
    model: {
      patient:{
        paginate
      }
    },
  });

boostedPrisma.$queryRaw`SET @@boost_cached_queries = true`;

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
if (env.NODE_ENV !== "production") globalForPrisma.prisma = boostedPrisma;
