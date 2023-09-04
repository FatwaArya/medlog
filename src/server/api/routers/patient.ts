import { z } from "zod";

import {
  createTRPCRouter,
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
import { Logger } from "next-axiom";

dayjs.extend(localeData);
dayjs.extend(isBetween);

interface GenderCount {
  date: string;
  Male: number;
  Female: number;
}

export const patientRouter = createTRPCRouter({
  createPresignedUrl: protectedProcedure

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
  createNewPatient: protectedProcedure
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
      const { userId, plan, log } = ctx as {
        userId: string;
        plan: string;
        log: Logger;
      };

      const userPlan = plan.toLowerCase();

      log.info("User plan", { userPlan });

      switch (userPlan) {
        case "free":
          const { success } = await ratelimit.FreePatient.limit(userId);
          if (!success) {
            log.error("Free patient limit failed", { success });
            throw new TRPCError({
              code: "BAD_REQUEST",
              message:
                "Limit pasien sudah tercapai. Ayo upgrade ke Professional!",
            });
          }
          break;
        case "personal":
          const { success: successPersonal } =
            await ratelimit.PersonalPatient.limit(userId);
          if (!successPersonal) {
            log.error("Personal patient limit failed", { successPersonal });
            throw new TRPCError({
              code: "BAD_REQUEST",
              message:
                "Limit pasien sudah tercapai. Ayo upgrade ke Professional!",
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

      await ctx.prisma.$transaction(async (tx) => {
        const isNumberUnique = await tx.patient.findFirst({
          where: {
            phone,
          },
        });

        //check if phone number is unique dont check if phone is nullish
        if (phone && isNumberUnique) {
          log.error("Phone number already registered", { phone });
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
            userId,
          },
        });

        log.info("Patient created", { patient });

        const record = await tx.medicalRecord.create({
          data: {
            pay,
            patientId: patient.id,
            complaint,
            diagnosis,
            treatment,
            labNote,
            checkup,
            note,
          },
        });

        log.info("Medical record created", { record });

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
              log.error("Invalid file uploaded", {
                object,
                fileType,
                upload,
              });
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

            log.info("File created", { file });

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
  createMedicalRecord: protectedProcedure
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
      const { userId, plan, log } = ctx as {
        userId: string;
        plan: string;
        log: Logger;
      };

      const userPlan = plan.toLowerCase();

      switch (userPlan) {
        case "free":
          const { success } = await ratelimit.FreeCheckup.limit(userId);
          if (!success) {
            log.error("Free checkup limit failed", { success });
            throw new TRPCError({
              code: "BAD_REQUEST",
              message:
                "Limit pasien sudah tercapai. Ayo upgrade ke Professional!",
            });
          }
          break;
        case "personal":
          const { success: successPersonal } =
            await ratelimit.PersonalCheckup.limit(userId);
          if (!successPersonal) {
            log.error("Personal checkup limit failed", { successPersonal });
            throw new TRPCError({
              code: "BAD_REQUEST",
              message:
                "Limit pasien sudah tercapai. Ayo upgrade ke Professional!",
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

        log.info("Medical record created", { record });

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
              log.error("Invalid file uploaded", {
                object,
                fileType,
                upload,
              });
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
  getNewestPatients: protectedProcedure
    .input(
      z.object({
        limit: z.number().gte(1).lte(5).nullish().nullable(),
        isLastVisit: z.boolean().nullish().nullable(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { userId, log } = ctx;

      const result = await ctx.prisma.medicalRecord.findMany({
        where: {
          patient: {
            userId,
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
          updatedAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        distinct: ["patientId"],
        ...(input?.limit && { take: input.limit }),
      });

      log.info("Newest patients fetched", { result });

      return result;
    }),
  getStatPatients: protectedProcedure.query(async ({ ctx }) => {
    const { userId, log } = ctx;

    const patientCount = await ctx.prisma.patient.count({
      where: {
        userId,
      },
    });

    log.info("Patient count fetched", { patientCount });

    const lastVisit = await ctx.prisma.medicalRecord.findFirst({
      where: {
        patient: {
          userId,
        },
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    log.info("Last visit fetched", { lastVisit });

    return {
      total: patientCount,
      lastVisit: lastVisit?.createdAt,
    };
  }),
  getStatLine: protectedProcedure

    .input(
      z
        .object({
          sortBy: z.enum(["month", "year", "all", "week"]).nullish(),
        })
        .nullish(),
    )
    .query(async ({ input, ctx }) => {
      const { userId, log } = ctx;

      const visits = await ctx.prisma.medicalRecord.findMany({
        where: {
          patient: {
            userId,
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

      log.info("Visits fetched", { visits });

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

      log.info("Weekly visits fetched", { weeklyVisits });

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

      log.info("All time visits fetched", { allTimeVisits });

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

      log.info("Yearly visits fetched", { yearlyVisits });

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

      log.info("Monthly visits fetched", { monthlyVisits });

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
      const { userId, log } = ctx;

      //check if patient is owned by user
      const patient = await ctx.prisma.patient.findFirst({
        where: {
          id: input.patientId,
          userId: userId as string,
        },
      });
      if (!patient) {
        log.error("Patient not found", { patientId: input.patientId });
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Patient not found",
        });
      }

      log.info("Patient fetched", { patient });

      return patient;
    }),
  searchPatient: protectedProcedure
    .input(
      z.object({
        query: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { userId, log } = ctx;

      const result = await ctx.prisma.patient.findMany({
        where: {
          userId: userId as string,
          name: {
            search: input.query,
          },
        },
      });

      log.info("Patient searched", { result });

      return result;
    }),
});
