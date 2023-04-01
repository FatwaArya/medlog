import { PrismaClient, Gender } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  //   // Create 10 patients
  //   const patients = Array.from({ length: 10 }).map(() => ({
  //     userId: "clfyalqo80000rhkwiraryjaw",
  //     name: faker.name.findName(),
  //     NIK: faker.random.alphaNumeric(16),
  //     phone: faker.phone.phoneNumber(),
  //     address: faker.address.streetAddress(),
  //     gender: faker.helpers.arrayElement(Object.values(Gender)),
  //     age: faker.datatype.number({ min: 18, max: 80 }),
  //     createdAt: faker.date.past(1),
  //     updatedAt: faker.date.recent(),
  //   }));

  //   // Insert patients into the database
  //   await prisma.patient.createMany({ data: patients });
  const createdPatients = await prisma.patient.findMany();
  const medicalRecords = [];
  for (const patient of createdPatients) {
    medicalRecords.push({
      patientId: patient.id,
      complaint: faker.lorem.sentence(),
      diagnosis: faker.lorem.sentence(),
      treatment: faker.lorem.sentence(),
      note: faker.lorem.sentence(),
      pay: faker.datatype.number({ min: 0, max: 1000000 }),
      createdAt: faker.date.past(1),
      updatedAt: faker.date.recent(),
    });
  }

  // Insert medical records into the database
  const createdMedicalRecords = await prisma.medicalRecord.createMany({
    data: medicalRecords,
  });

  console.log("Created patients:", createdPatients);
  console.log("Created medical records:", createdMedicalRecords);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
