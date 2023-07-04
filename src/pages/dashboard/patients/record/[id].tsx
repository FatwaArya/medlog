import Layout from "@/components/dashboard/Layout";
import type { PasienPlusPage } from "@/pages/_app";
import { generateSSGHelper } from "@/server/api/helpers/ssgHelper";
import { api } from "@/utils/api";
import {
  type GetServerSidePropsContext,
} from "next";
import Head from "next/head";
import { Spinner } from "@/components/ui/loading-overlay";
import CheckupList from "@/components/checkup/lists/checkup";
import { PatientDescription } from "../checkup/[id]/new";
import { getServerAuthSession } from "@/server/auth";
import Breadcrumbs from "@/components/ui/breadcrumb";

const PatientRecord: PasienPlusPage<{ id: string }> = ({ id }) => {
  const { data: patient, isLoading } = api.patient.getPatientById.useQuery({
    patientId: id,
  });

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
      <Breadcrumbs patientName={patient?.name} isPatientLast />
      <PatientDescription {...patient} />
      <CheckupList patientId={id} />
    </>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ id: string }>
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

  if (session?.user?.isNewUser) {
    return {
      redirect: {
        destination: "/auth/onboarding",
        permanent: false,
      },
    };
  }

  if (!session?.user?.isSubscribed) {
    return {
      redirect: {
        destination: "/subscription",
        permanent: false,
      },
    };
  }

  const helpers = generateSSGHelper();
  const id = context.params?.id as string;

  const reportExists = await helpers.patient.getPatientById.fetch({
    patientId: id,
  });
  if (reportExists) {
    await helpers.patient.getPatientById.prefetch({ patientId: id });
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

PatientRecord.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

PatientRecord.authRequired = true;

export default PatientRecord;
