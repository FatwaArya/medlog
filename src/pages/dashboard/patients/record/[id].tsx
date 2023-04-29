import Layout from "@/components/dashboard/Layout";
import type { PasienPlusPage } from "@/pages/_app";
import { generateSSGHelper } from "@/server/api/helpers/ssgHelper";
import { prisma } from "@/server/db";
import { api } from "@/utils/api";
import { type GetStaticPaths, type GetStaticPropsContext } from "next";
import Head from "next/head";
import dayjs from "dayjs";
import { Spinner } from "@/components/ui/loading-overlay";
import CheckupList from "@/components/checkup/lists/checkup";
import { PatientDescription } from "../checkup/[id]/new";


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
      {/* <div className="px-4 pb-5 pt-0 sm:px-6 ">
        <div >
          <h3 className="leading-6  scroll-m-20 text-2xl font-semibold tracking-tight text-[#3366FF]">Riyawat Pemeriksaan Pasien</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 line-clamp-2 pr-16">
            Riwayat pemeriksaan pasien yang telah dilakukan mulai dari tanggal <span className="font-semibold">{dayjs(patient?.MedicalRecord[patient?.MedicalRecord.length - 1]?.createdAt).format("DD MMMM YYYY")}</span> hingga <span className="font-semibold">{dayjs(patient?.MedicalRecord[0]?.createdAt).format("DD MMMM YYYY")}</span>
          </p>
        </div>
      </div>
      <div className="px-4 py-5 sm:px-6 ">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="text-sm text-slate-700 dark:text-slate-400 font-medium">Nama Lengkap</dt>
            <dd className="mt-1 text-sm text-gray-900">{patient?.name}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm text-slate-700 dark:text-slate-400 font-medium">Nomor Telepon</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{
              patient?.phone ?? "Tidak ada nomor telepon"
            }</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm text-slate-700 dark:text-slate-400 font-medium">Alamat Rumah</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{
              patient?.address ?? "Tidak ada alamat"
            }</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm text-slate-700 dark:text-slate-400 font-medium">Tanggal Lahir</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{
              dayjs(patient?.birthDate).format("DD MMMM YYYY") ?? "Tidak ada tanggal lahir"
            }</dd>
          </div>
        </dl>
      </div> */}
      <PatientDescription {...patient} />
      <CheckupList patientId={id} />
    </>)
};


export async function getStaticProps(
  context: GetStaticPropsContext<{ id: string }>
) {
  const ssg = generateSSGHelper();
  const id = context.params?.id as string;

  await ssg.patient.getPatientById.prefetch({ patientId: id })

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
    revalidate: 1,
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await prisma.patient.findMany({
    select: {
      id: true,
    },
  });

  return {
    paths: paths.map((path) => ({
      params: {
        id: path.id,
      },
    })),

    fallback: 'blocking',
  };
}

PatientRecord.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

PatientRecord.authRequired = true;

export default PatientRecord;