import Layout from "@/components/dashboard/Layout";
import { PasienPlusPage } from "@/pages/_app";
import { prisma } from "@/server/db";
import { Patient } from "@prisma/client";
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import { Head } from "next/document";
import { ParsedUrlQuery } from "querystring";

const Patient: PasienPlusPage = () => (
  <>
    <Head>
      <title>Pasien Plus | Patients</title>
    </Head>
  </>
);

interface PatientPageParams extends ParsedUrlQuery {
  id: string
}

export const getStaticProps: GetStaticProps<{ patient: Patient }, PatientPageParams> = async (ctx) => {
  const params = ctx.params!;

  const patient = await prisma.patient.findFirst({
    where: {
      id: params.id
    }
  });

  if (patient) {
    return {
      props: {
        patient
      },
      revalidate: 1
    }
  } else {
    return {
      notFound: true
    }
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  /*
    We wouldn't want to generate all patient pages at once, since it would make
    the compile time intolerably longer when there's a lot of patients.

    Rather, we want to generate each page on first request.
    */
   
  return {
    paths: [],
    fallback: "blocking"
  }
}

Patient.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

Patient.authRequired = true;

export default Patient;
