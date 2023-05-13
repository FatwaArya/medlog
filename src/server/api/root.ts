import { createTRPCRouter } from "@/server/api/trpc";
import { patientRouter } from "./routers/patient";
import { recordRouter } from "./routers/record";
import { medicineRouter } from "./routers/medicine";
import { userRouter } from "./routers/user";
import { adminRouter } from "./routers/admin";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  patient: patientRouter,
  record: recordRouter,
  medicine: medicineRouter,
  user: userRouter,
  admin: adminRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
