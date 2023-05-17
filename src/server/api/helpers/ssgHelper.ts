import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "../root";
import { prisma } from "@/server/db";
import superjson from "superjson";
import type { Session } from "next-auth";

export const generateSSGHelper = () =>
  createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, session: null },
    transformer: superjson,
  });
