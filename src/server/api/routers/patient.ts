import { z } from "zod";

import {
  createTRPCRouter,
  protectedSubscribedProcedure,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import dayjs from "dayjs";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../../s3";
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { type Readable } from "stream";
import probe from "probe-image-size";
import localeData from "dayjs/plugin/localeData";
import isBetween from "dayjs/plugin/isBetween";
import { TRPCError } from "@trpc/server";
import ratelimit from "../helpers/rateLimiter";

dayjs.extend(localeData);
dayjs.extend(isBetween);

interface GenderCount {
  date: string;
  Male: number;
  Female: number;
}

export const patientRouter = createTRPCRouter({
  createPresignedUrl: protectedSubscribedProcedure

    .input(z.object({ count: z.number().gte(1).lte(8) }))
    .query(async ({ input }) => {
      const urls = [];

      for (let i = 0; i < input.count; i++) {
        const key = uuidv4();

        const url = await getSignedUrl(
          s3Client,
          new PutObjectCommand({
            Bucket: "pasienplus",
            Key: key,
          }),
        );

        urls.push({
          url,
          key,
        });
      }
      return urls;
    }),
  /**
   * create new patient procedure
   *
   * this procedure only calls when user is registering new patient for the first time
   *
   */
  createNewPatient: protectedSubscribedProcedure

    .input(
      z.object({
        name: z.string(),
        phone: z.string().nullish(),
        gender: z.enum(["male", "female"]),
        address: z.string(),
        birthDate: z.date(),
        complaint: z.string(),
        treatment: z.string(),
        checkup: z.string(),
        diagnosis: z.string(),
        drugs: z
          .array(
            z.object({
              value: z.string(),
              label: z.string(),
            }),
          )
          .nullish(),
        labNote: z.string(),
        note: z.string(),
        pay: z.number().min(0, { message: "Fee tidak boleh kosong" }),
        files: z
          .array(
            z.object({
              key: z.string().min(1),
              ext: z.string().min(1),
            }),
          )
          .max(8, { message: "Maksimal 8 foto" })
          .nullish(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      const userPlan = ctx.session.user.plan;

      switch (userPlan) {
        case "beginner":
          const { success } = await ratelimit.BPatient.limit(userId);
          if (!success) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Limit pasien sudah tercapai",
            });
          }
          break;
        case "personal":
          const { success: successPersonal } = await ratelimit.PPatient.limit(
            userId,
          );
          if (!successPersonal) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Limit pasien sudah tercapai",
            });
          }
          break;
        case "professional":
          break;
      }

      const {
        name,
        phone,
        gender,
        address,
        birthDate,
        complaint,
        diagnosis,
        drugs,
        treatment,
        checkup,
        note,
        pay,
        files,
        // labFiles,
        labNote,
      } = input;
      //merge files and labFiles
      // const allFiles = files?.concat(labFiles ?? []);

      await ctx.prisma.$transaction(async (tx) => {
        const isNumberUnique = await tx.patient.findFirst({
          where: {
            phone,
          },
        });

        //check if phone number is unique dont check if phone is nullish
        if (phone && isNumberUnique) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Nomor telepon sudah terdaftar",
          });
        }

        const patient = await tx.patient.create({
          data: {
            name,
            phone,
            gender,
            address,
            birthDate,
            userId: ctx.session.user.id,
          },
        });

        const record = await tx.medicalRecord.create({
          data: {
            pay,
            patientId: patient.id,
            complaint,
            diagnosis,
            treatment,
            labNote,
            note,
          },
        });

        await tx.medicineDetail.createMany({
          //create with nullish value
          data:
            drugs?.map((medicine) => ({
              medicalRecordId: record.id,
              medicineId: medicine.value,
            })) || [],
        });

        if (files) {
          for (const upload of files) {
            const uuid = uuidv4();
            const name = uuid + "." + upload.ext;

            await s3Client.send(
              new CopyObjectCommand({
                Bucket: "pasienplus",
                CopySource: "pasienplus/" + upload.key,
                Key: name,
                ACL: "public-read",
              }),
            );

            await s3Client.send(
              new DeleteObjectCommand({
                Bucket: "pasienplus",
                Key: upload.key,
              }),
            );

            const object = await s3Client.send(
              new GetObjectCommand({
                Bucket: "pasienplus",
                Key: name,
              }),
            );

            const fileType = await probe(object.Body as Readable);

            //if file mime is jpeg change it to jpg so it dont return error
            if (upload.ext === "jpeg") {
              upload.ext = "jpg";
            }

            if (
              !object.ContentLength ||
              !fileType ||
              upload.ext !== fileType.type
            ) {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Invalid file uploaded.",
              });
            }

            const file = await tx.file.create({
              data: {
                type: "IMAGE",
                url: "https://pasienplus.sgp1.digitaloceanspaces.com/" + name,
                mime: fileType.mime,
                extension: upload.ext,
                name,
                size: object.ContentLength as number,
                width: fileType.height,
                height: fileType.width,
              },
            });

            await tx.attachment.create({
              data: {
                medicalRecordId: record.id,
                fileId: file.id,
              },
            });
          }
        }
      });
    }),
  /**
   * create medical record procedure
   *
   * this procedure only calls when user is creating new medical record for existing patient
   *
   */
  createMedicalRecord: protectedSubscribedProcedure
    .input(
      z.object({
        patientId: z.string(),
        complaint: z.string(),
        diagnosis: z.string(),
        treatment: z.string(),
        drugs: z
          .array(
            z.object({
              value: z.string(),
              label: z.string(),
            }),
          )
          .nullish(),
        labNote: z.string(),
        note: z.string(),
        checkup: z.string(),
        pay: z.number().min(0),
        files: z
          .array(
            z.object({
              key: z.string().min(1),
              ext: z.string().min(1),
            }),
          )
          .max(8, { message: "Maksimal 8 foto" })
          .nullish(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      const userPlan = ctx.session.user.plan;

      switch (userPlan) {
        case "beginner":
          const { success } = await ratelimit.BCheckup.limit(userId);
          if (!success) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Limit pasien sudah tercapai",
            });
          }
          break;
        case "personal":
          const { success: successPersonal } = await ratelimit.PCheckup.limit(
            userId,
          );
          if (!successPersonal) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Limit pasien sudah tercapai",
            });
          }
          break;
        case "professional":
          break;
      }

      const {
        patientId,
        complaint,
        diagnosis,
        note,
        checkup,
        treatment,
        pay,
        labNote,
        files,
        drugs,
      } = input;

      await ctx.prisma.$transaction(async (tx) => {
        const record = await ctx.prisma.medicalRecord.create({
          data: {
            pay,
            patientId,
            complaint,
            diagnosis,
            treatment,
            checkup,
            note,
            labNote,
          },
        });

        await tx.medicineDetail.createMany({
          data:
            drugs?.map((medicine) => ({
              medicalRecordId: record.id,
              medicineId: medicine.value,
            })) || [],
        });

        if (files) {
          for (const upload of files) {
            const uuid = uuidv4();
            const name = uuid + "." + upload.ext;

            await s3Client.send(
              new CopyObjectCommand({
                Bucket: "pasienplus",
                CopySource: "pasienplus/" + upload.key,
                Key: name,
                ACL: "public-read",
              }),
            );

            await s3Client.send(
              new DeleteObjectCommand({
                Bucket: "pasienplus",
                Key: upload.key,
              }),
            );

            const object = await s3Client.send(
              new GetObjectCommand({
                Bucket: "pasienplus",
                Key: name,
              }),
            );
            const fileType = await probe(object.Body as Readable);

            //if file mime is jpeg change it to jpg so it dont return error
            if (upload.ext === "jpeg") {
              upload.ext = "jpg";
            }

            if (
              !object.ContentLength ||
              !fileType ||
              upload.ext !== fileType.type
            ) {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Invalid file uploaded.",
              });
            }

            const file = await tx.file.create({
              data: {
                type: "IMAGE",
                url: "https://pasienplus.sgp1.digitaloceanspaces.com/" + name,
                mime: fileType.mime,
                extension: upload.ext,
                name,
                size: object.ContentLength as number,
                width: fileType.height || 0,
                height: fileType.width || 0,
              },
            });

            await tx.attachment.create({
              data: {
                medicalRecordId: record.id,
                fileId: file.id,
              },
            });
          }
        }
      });
    }),
  getNewestPatients: protectedSubscribedProcedure
    .input(
      z.object({
        limit: z.number().gte(1).lte(5).nullish().nullable(),
        isLastVisit: z.boolean().nullish().nullable(),
      }),
    )
    .query(async ({ ctx, input }) => {
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
              phone: true,
            },
          },
          ...(input?.isLastVisit && { createdAt: true }),
        },
        orderBy: {
          createdAt: "desc",
        },
        distinct: ["patientId"],
        ...(input?.limit && { take: input.limit }),
      });
      return result;
    }),
  getStatPatients: protectedSubscribedProcedure.query(async ({ ctx }) => {
    const patientCount = await ctx.prisma.patient.count({
      where: {
        userId: ctx.session.user.id,
      },
    });
    const lastVisit = await ctx.prisma.medicalRecord.findFirst({
      where: {
        patient: {
          userId: ctx.session.user.id,
        },
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return {
      total: patientCount,
      lastVisit: lastVisit?.createdAt,
    };
  }),
  getStatLine: protectedSubscribedProcedure

    .input(
      z
        .object({
          sortBy: z.enum(["month", "year", "all", "week"]).nullish(),
        })
        .nullish(),
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
      const currentYear = dayjs().format("YYYY");
      const currentMonthYear = dayjs().format("MMM YYYY");

      const startOfWeek = dayjs().startOf("week");

      const weeklyVisits = Array.from({ length: 7 }, (_, i) => {
        const date = startOfWeek.add(i, "day");
        const dateString = date.locale("id").format("ddd D");
        const dayVisits = visits
          .filter((visit) => {
            const createdAt = dayjs(visit.createdAt);
            return createdAt.isSame(date, "day");
          })
          .reduce(
            (counts, visit) => {
              if (visit.patient.gender === "male") {
                counts.Male += 1;
              } else if (visit.patient.gender === "female") {
                counts.Female += 1;
              }
              return counts;
            },
            { Male: 0, Female: 0 },
          );

        return {
          date: dateString,
          Male: dayVisits.Male,
          Female: dayVisits.Female,
        };
      });

      const allTimeVisits = visits.reduce((acc: GenderCount[], cur) => {
        const existingCount = acc.find((count) =>
          dayjs(count.date, "MMMM YYYY").isSame(cur.createdAt, "month"),
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
            (count) => count.date === createdAt.format("MMMM YYYY"),
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
            (count) => count.date === createdAt.format("DD MMM"),
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
        case "week":
          return weeklyVisits;
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
  getPatientById: publicProcedure

    .input(
      z.object({
        patientId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      //check if patient is owned by user
      const patient = await ctx.prisma.patient.findFirst({
        where: {
          id: input.patientId,
          userId: ctx.session?.user.id,
        },
      });
      if (!patient) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Patient not found",
        });
      }
      return patient;
    }),
  searchPatient: protectedSubscribedProcedure
    .input(
      z.object({
        query: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const result = await ctx.prisma.patient.findMany({
        where: {
          userId: ctx.session.user.id,
          name: {
            search: input.query,
          },
        },
      });
      return result;
    }),
});
