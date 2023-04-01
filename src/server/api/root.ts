import { createTRPCRouter } from "@/server/api/trpc";
import { patientRouter } from "./routers/patient";
import { recordRouter } from "./routers/record";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  patient: patientRouter,
  record: recordRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
