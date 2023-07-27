import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "../root";
import { boostedPrisma, prisma } from "@/server/db";
import superjson from "superjson";
import type { Session } from "next-auth";

export const generateSSGHelper = () =>
  createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, boostedPrisma, session: null },
    transformer: superjson,
  });
