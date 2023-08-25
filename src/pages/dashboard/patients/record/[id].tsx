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
import { useRouter } from "next/router";


const PatientRecord: PasienPlusPage = () => {
  const router = useRouter()
  const { id } = router.query as { id: string };


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
      {/* <Breadcrumbs patientName={patient?.name} isPatientLast /> */}
      <PatientDescription {...patient} />
      <CheckupList patientId={id} />
    </>
  );
};



PatientRecord.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

PatientRecord.authRequired = true;

export default PatientRecord;
