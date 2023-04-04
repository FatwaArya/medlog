import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import dayjs from "dayjs";

import relativeTime from "dayjs/plugin/relativeTime";
import localeData from "dayjs/plugin/localeData";
dayjs.extend(localeData);

interface GenderCount {
  date: string;
  Male: number;
  Female: number;
}

export const patientRouter = createTRPCRouter({
  /**
   * create new patient procedure
   *
   * this procedure only calls when user is registering new patient for the first time
   *
   */
  createNewPatient: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        phone: z.string().min(10).max(10),
        gender: z.enum(["male", "female"]),
        address: z.string(),
        nik: z.string().min(16).max(16),
        birthDate: z.date(),
        complaint: z.string(),
        diagnosis: z.string(),
        treatment: z.string(),
        note: z.string(),
        pay: z.number().min(0),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const {
        name,
        phone,
        gender,
        address,
        birthDate,
        complaint,
        diagnosis,
        treatment,
        note,
        pay,
        nik,
      } = input;
      //Encrypt NIK

      await ctx.prisma.$transaction(async (tx) => {
        const { id } = await tx.patient.create({
          data: {
            name,
            phone,
            gender,
            address,
            NIK: nik,
            birthDate,
            userId: ctx.session.user.id,
          },
        });
        await tx.medicalRecord.create({
          data: {
            pay,
            patientId: id,
            complaint,
            diagnosis,
            treatment,
            note,
          },
        });
      });
    }),
  getNewestPatients: protectedProcedure.query(async ({ ctx }) => {
    //select newest patients
    const result = await ctx.prisma.medicalRecord.findMany({
      where: {
        patient: {
          userId: ctx.session.user.id,
        },
      },
      select: {
        patient: {
          select: {
            id: true,
            name: true,
            birthDate: true,
            gender: true,
            NIK: true,
          },
        },
        createdAt: true,
      },

      orderBy: {
        createdAt: "desc",
      },

      take: 10,
      distinct: ["patientId", "createdAt"],
    });
    return result;
  }),
  getStatPatients: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.prisma.patient.aggregate({
      where: {
        userId: ctx.session.user.id,
      },
      _count: true,
      _max: {
        createdAt: true,
      },
    });
    const total = result._count;
    const lastPatient = result._max;
    return {
      total,
      lastPatient,
    };
  }),
  getStatLine: protectedProcedure
    .input(
      z
        .object({
          sortBy: z.enum(["month", "year", "all"]).nullish(),
        })
        .nullish()
    )
    .query(async ({ input, ctx }) => {
      const visits = await ctx.prisma.medicalRecord.findMany({
        where: {
          patient: {
            userId: ctx.session.user.id,
          },
        },
        select: {
          createdAt: true,
          patient: {
            select: {
              gender: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      // const visits = record.reduce((acc: GenderCount[], cur) => {
      //   const existingCount = acc.find((count) =>
      //     dayjs(count.date).isSame(cur.createdAt, "day")
      //   );

      //   if (existingCount) {
      //     if (cur.patient.gender === "male") {
      //       existingCount.Male += 1;
      //     } else if (cur.patient.gender === "female") {
      //       existingCount.Female += 1;
      //     }
      //   } else {
      //     const newCount = {
      //       date: dayjs(cur.createdAt).format("DD MMMM YYYY"),
      //       Male: cur.patient.gender === "male" ? 1 : 0,
      //       Female: cur.patient.gender === "female" ? 1 : 0,
      //     };
      //     acc.push(newCount);
      //   }

      //   return acc;
      // }, []);
      const currentYear = dayjs().format("YYYY");
      const currentMonthYear = dayjs().format("MMM YYYY");
      const allTimeVisits = visits.reduce((acc: GenderCount[], cur) => {
        const existingCount = acc.find((count) =>
          dayjs(count.date, "MMMM YYYY").isSame(cur.createdAt, "month")
        );

        if (existingCount) {
          if (cur.patient.gender === "male") {
            existingCount.Male += 1;
          } else if (cur.patient.gender === "female") {
            existingCount.Female += 1;
          }
        } else {
          const newCount = {
            date: dayjs(cur.createdAt).format("MMM YYYY"),
            Male: cur.patient.gender === "male" ? 1 : 0,
            Female: cur.patient.gender === "female" ? 1 : 0,
          };
          acc.push(newCount);
        }

        return acc;
      }, []);

      const yearlyVisits = visits.reduce((acc: GenderCount[], cur) => {
        const createdAt = dayjs(cur.createdAt);
        if (createdAt.isSame(currentYear, "year")) {
          const existingCount = acc.find(
            (count) => count.date === createdAt.format("MMMM YYYY")
          );
          if (existingCount) {
            if (cur.patient.gender === "male") {
              existingCount.Male += 1;
            } else if (cur.patient.gender === "female") {
              existingCount.Female += 1;
            }
          } else {
            const newCount = {
              date: createdAt.format("MMMM YYYY"),
              Male: cur.patient.gender === "male" ? 1 : 0,
              Female: cur.patient.gender === "female" ? 1 : 0,
            };
            acc.push(newCount);
          }
        }
        return acc;
      }, []);

      const monthlyVisits = visits.reduce((acc: GenderCount[], cur) => {
        const createdAt = dayjs(cur.createdAt);
        if (createdAt.isSame(currentMonthYear, "month")) {
          const existingCount = acc.find(
            (count) => count.date === createdAt.format("DD MMM")
          );
          if (existingCount) {
            if (cur.patient.gender === "male") {
              existingCount.Male += 1;
            } else if (cur.patient.gender === "female") {
              existingCount.Female += 1;
            }
          } else {
            const newCount = {
              date: createdAt.format("DD MMM"),
              Male: cur.patient.gender === "male" ? 1 : 0,
              Female: cur.patient.gender === "female" ? 1 : 0,
            };
            acc.push(newCount);
          }
        }
        return acc;
      }, []);
      switch (input?.sortBy) {
        case "month":
          return monthlyVisits;
        case "year":
          return yearlyVisits;
        case "all":
          return allTimeVisits;
        default:
          return monthlyVisits;
      }
    }),
});
