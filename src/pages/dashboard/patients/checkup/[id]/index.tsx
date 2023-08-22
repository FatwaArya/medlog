import Layout from "@/components/dashboard/Layout";
import type { PasienPlusPage } from "@/pages/_app";
import { generateSSGHelper } from "@/server/api/helpers/ssgHelper";
import { api } from "@/utils/api";
import { useState } from "react";
import Head from "next/head";
import type {
  GetServerSidePropsContext,
} from "next/types";
import type { RouterOutputs } from "@/utils/api";
import { PatientDescription } from "./new";
import { Spinner } from "@/components/ui/loading-overlay";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ImageOff } from "lucide-react";

import Breadcrumbs from "@/components/ui/breadcrumb";
import { getAuth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs";


type PatientInfo = NonNullable<
  RouterOutputs["record"]["getRecordById"]
>["patient"];

const CheckupDetail: PasienPlusPage<{ id: string }> = ({ id }) => {
  const { data: report, isLoading } = api.record.getRecordById.useQuery({ id });

  const [activeSlide, setActiveSlide] = useState(0);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex items-center justify-center">
        <h1 className="scroll-m-20 text-xl font-extrabold tracking-tight">
          Data pemeriksaan tidak ada
        </h1>
      </div>
    );
  }

  const attachment = report?.Attachment;

  function goToPrevSlide() {
    setActiveSlide((activeSlide - 1 + attachment.length) % attachment.length);
  }

  function goToNextSlide() {
    setActiveSlide((activeSlide + 1) % attachment.length);
  }
  return (
    <>
      <Head>
        <title>Pasien Plus | Detail Pemeriksaan {report?.patient.name}</title>
      </Head>
      <Breadcrumbs patientName={report?.patient.name} isPatientLast />
      <div>
        <PatientDescription {...(report?.patient as PatientInfo)} />
        <div className="overflow-hidden bg-white shadow outline outline-1 outline-slate-200 sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-blue-600">
              Data Pemeriksaan
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Informasi detail pasien pada pemeriksaan.
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className=" flex max-w-full flex-col gap-y-8">
              <div className="flex w-full flex-col items-start sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Komplain </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {report?.complaint ?? "Belum ada komplain"}
                </dd>
              </div>
              <div className="flex w-full flex-col items-start sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Diagnosa </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {report?.diagnosis ?? "Belum ada diagnosis"}
                </dd>
              </div>
              <div className="flex w-full flex-col items-start sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">
                  Pemeriksaan{" "}
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {report?.checkup ?? "Belum ada checkup"}
                </dd>
              </div>
              <div className="flex w-full flex-col items-start sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Terapi </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {report.MedicineDetail.map((item, i) => (
                    <span key={i} className="capitalize">
                      {item.medicine.name}
                      {i !== report.MedicineDetail.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </dd>
              </div>
              <div className="flex w-full flex-col items-start sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Tindakan </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {report?.treatment ?? "Belum ada tindakan"}
                </dd>
              </div>
              <div className="flex w-full flex-col items-start sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">
                  Catatan Lab{" "}
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {report?.labNote ?? "Belum ada catatan lab"}
                </dd>
              </div>
              <div className="flex w-full flex-col items-start sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">
                  Nominal Pembayaran{" "}
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {report?.pay.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }) ?? "Belum ada nominal pembayaran"}
                </dd>
              </div>
              <div className="flex w-full flex-col items-start sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">
                  Foto Luka dan Hasil Lab
                </dt>
                <div className="mt-1 flex w-full flex-col items-center justify-start sm:w-auto">
                  {attachment.length !== 0 ? (
                    attachment.map((item, i) => (
                      <div
                        key={i}
                        className={`${i === activeSlide
                          ? "z-10 opacity-100"
                          : "absolute z-0 opacity-0"
                          } w-full max-w-sm rounded-sm border border-gray-200 p-2`}
                      >
                        <div className="relative">
                          <Image
                            src={item?.File?.url as string}
                            alt={item?.File?.name as string}
                            width={576}
                            height={20}
                            className="h-full max-h-52 cursor-pointer rounded-sm object-cover hover:brightness-75"
                          />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity hover:opacity-100">
                            <Dialog>
                              <DialogTrigger>
                                <Button size="sm" variant="solidWhite">
                                  Lihat Detail
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="w-[340px] sm:w-full sm:min-w-[1200px]">
                                <DialogHeader>
                                  <DialogTitle>Attachment Detail</DialogTitle>
                                </DialogHeader>
                                <div className="h-[240px] overflow-y-scroll sm:h-[600px]">
                                  {isLoading ? (
                                    <div className="flex h-full items-center justify-center">
                                      <Spinner />
                                    </div>
                                  ) : (
                                    <Image
                                      src={item?.File?.url as string}
                                      alt={item?.File?.name as string}
                                      width={1280}
                                      height={20}
                                      quality={100}
                                      className="h-auto w-full object-cover"
                                    />
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex h-[208px] w-full items-center justify-center rounded-sm border border-gray-200 p-2 sm:w-[576px]">
                      <div className="flex flex-col items-center gap-4">
                        <ImageOff className="text-gray-400" />
                        <p className="text-sm font-medium text-gray-400">
                          Belum ada foto
                        </p>
                      </div>
                    </div>
                  )}
                  {attachment.length !== 0 && (
                    <div className="mt-3 flex w-full items-center justify-between">
                      <Button size="sm" variant="ghost" onClick={goToPrevSlide}>
                        Prev
                      </Button>
                      <p className="text-sm font-medium text-gray-600">
                        {activeSlide + 1} / {attachment.length}
                      </p>
                      <Button size="sm" variant="ghost" onClick={goToNextSlide}>
                        Next
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckupDetail;

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ id: string }>
) {
  const { userId } = getAuth(context.req);
  const user = userId ? await clerkClient.users.getUser(userId) : undefined;


  if (!user) {
    return {
      redirect: {
        destination: "/auth/sign-in",
        permanent: false,
      },
    };
  }


  if (user?.publicMetadata.isSubscribed) {
    return {
      redirect: {
        destination: "/subscription",
        permanent: false,
      },
    };
  }

  const helpers = generateSSGHelper();
  const id = context.params?.id as string;

  const reportExists = await helpers.record.getRecordById.fetch({ id });
  if (reportExists) {
    await helpers.record.getRecordById.prefetch({ id });
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

CheckupDetail.authRequired = true;

CheckupDetail.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
