import { Gender, PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  const patients = Array.from({ length: 150 }).map(() => ({
    userId: "user_2UNNakK6Hfp7vMhOE2Ma1i99MdU",
    name: faker.name.fullName(),
    phone: faker.phone.number(),
    address: faker.address.streetAddress(),
    gender: faker.helpers.arrayElement(Object.values(Gender)),
    birthDate: faker.date.past(50),
    createdAt: faker.date.past(1),
    updatedAt: faker.date.recent(),
  }));

  // Insert patients into the database
  const createdPatients = [];
  for (const patient of patients) {
    const createdPatient = await prisma.patient.create({ data: patient });
    createdPatients.push(createdPatient);
  }

  console.log("Created patients:", createdPatients);

  // Create medical records for each patient
  const medicalRecords = [];

  for (const patient of createdPatients) {
    for (let i = 0; i < 5; i++) {
      const medicalRecord = {
        patientId: patient.id,
        complaint: faker.lorem.sentence(),
        diagnosis: faker.lorem.sentence(),
        note: faker.lorem.sentence(),
        pay: faker.datatype.number({ min: 0, max: 1000000 }),
        // createdAt may 2023
        createdAt: faker.date.between("2023-07-28", "2023-08-27"),
      };
      medicalRecords.push(medicalRecord);
    }
  }

  // Insert medical records into the database
  const createdMedicalRecords = await prisma.medicalRecord.createMany({
    data: medicalRecords,
  });

  console.log("Created medical records:", createdMedicalRecords);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
