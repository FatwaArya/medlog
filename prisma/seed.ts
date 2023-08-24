import { Gender, PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  // Create 10 patients
  const patients = Array.from({ length: 10 }).map(() => ({
    userId: "user_2UNNakK6Hfp7vMhOE2Ma1i99MdU",
    name: faker.name.fullName(),
    phone: faker.phone.number(),
    address: faker.address.streetAddress(),
    gender: faker.helpers.arrayElement(Object.values(Gender)),
    birthDate: faker.date.past(50),
    createdAt: faker.date.past(1),
    updatedAt: faker.date.recent(),
  }));

  // // Insert patients into the database
  await prisma.patient.createMany({ data: patients });
  const createdPatients = await prisma.patient.findMany();
  const medicalRecords = [];
  for (const patient of createdPatients) {
    medicalRecords.push({
      patientId: patient.id,
      complaint: faker.lorem.sentence(),
      diagnosis: faker.lorem.sentence(),
      note: faker.lorem.sentence(),
      pay: faker.datatype.number({ min: 0, max: 1000000 }),
      //createdAt may 2023
      createdAt: faker.date.between("2023-04-4", "2023-04-12"),
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
