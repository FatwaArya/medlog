import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "../root";
import { boostedPrisma, prisma } from "@/server/db";
import superjson from "superjson";

export const generateSSGHelper = () =>
  createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, boostedPrisma, auth: null },
    transformer: superjson,
  });
