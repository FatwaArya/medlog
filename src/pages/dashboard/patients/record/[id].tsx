import Layout from "@/components/dashboard/Layout";
import type { PasienPlusPage } from "@/pages/_app";
import { api } from "@/utils/api";
import Head from "next/head";
import { Spinner } from "@/components/ui/loading-overlay";
import CheckupList from "@/components/checkup/lists/checkup";
import { PatientDescription } from "../checkup/[id]/new";
import { GetServerSidePropsContext } from "next/types";
import { User, getAuth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs";
import { generateSSGHelper } from "@/server/api/helpers/ssgHelper";


const PatientRecord: PasienPlusPage<{ id: string }> = ({ id }) => {
  const { data: patient, isLoading } = api.patient.getPatientById.useQuery({
    patientId: id,
  });

  console.log(id)

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex items-center justify-center">
        <h1 className="text-xl font-bold">Patient not found</h1>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Pasien Plus | {patient?.name ?? "Patient not found"}</title>
      </Head>
      {/* <Breadcrumbs patientName={patient?.name} isPatientLast /> */}
      <PatientDescription {...patient} />
      <CheckupList patientId={id} />
    </>
  );
};

// export async function getServerSideProps(
//   context: GetServerSidePropsContext<{ id: string }>
// ) {
//   const { userId } = getAuth(context.req);
//   const user = userId ? await clerkClient.users.getUser(userId) : undefined;


//   if (!user) {
//     return {
//       redirect: {
//         destination: "/auth/sign-in",
//         permanent: false,
//       },
//     };
//   }


//   if (user?.publicMetadata.isSubscribed) {
//     return {
//       redirect: {
//         destination: "/subscription",
//         permanent: false,
//       },
//     };
//   }

//   const helpers = generateSSGHelper(user as User);
//   const id = context.params?.id as string;

//   const reportExists = await helpers.record.getRecordById.fetch({ id });
//   if (reportExists) {
//     await helpers.record.getRecordById.prefetch({ id });
//   } else {
//     return {
//       props: { id },
//       notFound: true,
//     };
//   }

//   return {
//     props: {
//       trpcState: helpers.dehydrate(),
//       id,
//     },
//   };
// }


PatientRecord.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

PatientRecord.authRequired = true;

export default PatientRecord;
