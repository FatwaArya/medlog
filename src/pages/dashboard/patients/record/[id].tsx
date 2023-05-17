import Layout from "@/components/dashboard/Layout";
import type { PasienPlusPage } from "@/pages/_app";
import { generateSSGHelper } from "@/server/api/helpers/ssgHelper";
import { prisma } from "@/server/db";
import { api } from "@/utils/api";
import { GetServerSidePropsContext, type GetStaticPaths, type GetStaticPropsContext } from "next";
import Head from "next/head";
import dayjs from "dayjs";
import { Spinner } from "@/components/ui/loading-overlay";
import CheckupList from "@/components/checkup/lists/checkup";
import { PatientDescription } from "../checkup/[id]/new";
import { getServerAuthSession } from "@/server/auth";


const PatientRecord: PasienPlusPage<{ id: string }> = ({ id }) => {
  const { data: patient, isLoading } = api.patient.getPatientById.useQuery({ patientId: id }, {
    //if patient is not found, don't retry
    retry: false,
  })

  if (isLoading) {
    return <div className="flex justify-center h-full items-center">
      <Spinner />
    </div>
  }

  if (!patient) {
    return <div className="flex justify-center items-center">
      <h1 className="text-xl font-bold">Patient not found</h1>
    </div>
  }

  return (
    <>
      <Head>
        <title>Pasien Plus | {
          patient?.name ?? "Patient not found"
        }</title>
      </Head>
      <PatientDescription {...patient} />
      <CheckupList patientId={id} />
    </>
  )
};

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ id: string }>,
) {
  const session = await getServerAuthSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  if (session?.user?.isSubscribed === false) {
    return {
      redirect: {
        destination: "/subscription",
        permanent: false,
      },
    };
  }

  const helpers = generateSSGHelper()
  const id = context.params?.id as string;

  const reportExists = await helpers.patient.getPatientById.fetch({ patientId: id })
  if (reportExists) {
    await helpers.patient.getPatientById.prefetch({ patientId: id })
  } else {
    return {
      props: { id },
      notFound: true,
    };
  }

  return {
    props: {
      trpcState: helpers.dehydrate(),
      id,
    },
  };
}

// export async function getStaticProps(
//   context: GetStaticPropsContext<{ id: string }>
// ) {
//   const ssg = generateSSGHelper();
//   const id = context.params?.id as string;

//   await ssg.patient.getPatientById.prefetch({ patientId: id })

//   return {
//     props: {
//       trpcState: ssg.dehydrate(),
//       id,
//     },
//     revalidate: 1,
//   };
// }

// export const getStaticPaths: GetStaticPaths = async () => {
//   const paths = await prisma.patient.findMany({
//     select: {
//       id: true,
//     },
//   });

//   return {
//     paths: paths.map((path) => ({
//       params: {
//         id: path.id,
//       },
//     })),

//     fallback: 'blocking',
//   };
// }

PatientRecord.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

PatientRecord.authRequired = true;


export default PatientRecord;

