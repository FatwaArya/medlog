import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
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
import { Readable } from "stream";
import probe from "probe-image-size";
import relativeTime from "dayjs/plugin/relativeTime";
import localeData from "dayjs/plugin/localeData";
import { TRPCError } from "@trpc/server";
dayjs.extend(localeData);

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
          })
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
        phone: z
          .string()
          .length(11, { message: "Phone number must be 12 digits" }),
        gender: z.enum(["male", "female"]),
        address: z.string(),
        birthDate: z.date(),
        complaint: z.string(),
        diagnosis: z.string(),
        treatment: z.string(),
        labNote: z.string(),
        note: z.string(),
        pay: z.number().min(0, { message: "Fee tidak boleh kosong" }),
        files: z
          .array(
            z.object({
              key: z.string().min(1),
              ext: z.string().min(1),
            })
          )
          .max(8, { message: "Maksimal 8 foto" })
          .nullish(),
        // labFiles: z
        //   .array(
        //     z.object({
        //       key: z.string().min(1),
        //       ext: z.string().min(1),
        //     })
        //   )
        //   .max(4, { message: "Maksimal 4 foto" })
        //   .nullish(),
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
        files,
        // labFiles,
        labNote,
      } = input;
      //merge files and labFiles
      // const allFiles = files?.concat(labFiles ?? []);

      await ctx.prisma.$transaction(async (tx) => {
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
        const medicalRecord = await tx.medicalRecord.create({
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
              })
            );

            await s3Client.send(
              new DeleteObjectCommand({
                Bucket: "pasienplus",
                Key: upload.key,
              })
            );

            const object = await s3Client.send(
              new GetObjectCommand({
                Bucket: "pasienplus",
                Key: name,
              })
            );

            const fileType = await probe(object.Body as Readable);

            //file validation
            // if (
            //   !object.ContentLength ||
            //   !fileType ||
            //   (upload.ext !== fileType.type && upload.ext !== "pdf")
            // ) {
            //   throw new TRPCError({
            //     code: "BAD_REQUEST",
            //     message: "Invalid file uploaded.",
            //   });
            // }

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
                medicalRecordId: medicalRecord.id,
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
        note: z.string(),
        pay: z.number().min(0),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { patientId, complaint, diagnosis, treatment, note, pay } = input;
      await ctx.prisma.medicalRecord.create({
        data: {
          pay,
          patientId,
          complaint,
          diagnosis,
          treatment,
          note,
        },
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
          },
        },
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },

      distinct: ["patientId"],
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
