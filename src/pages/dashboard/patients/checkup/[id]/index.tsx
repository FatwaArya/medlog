import Layout from "@/components/dashboard/Layout";
import type { PasienPlusPage } from "@/pages/_app";
import { generateSSGHelper } from "@/server/api/helpers/ssgHelper";
import { prisma } from "@/server/db";
import { api } from "@/utils/api";
import { useState } from "react"
import Head from "next/head";
import type { GetStaticPaths, GetStaticPropsContext } from "next/types";
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
} from "@/components/ui/dialog"
import { ImageOffIcon } from "lucide-react"
import Breadcrumbs from "@/components/ui/breadcrumb";
import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { AspectRatio } from "@/components/ui/aspect-ratio";



type PatientInfo = NonNullable<RouterOutputs["record"]['getRecordById']>['patient']
type PatientAttachment = NonNullable<RouterOutputs["record"]['getRecordById']>['Attachment']



function CarouselAttachment(attachments: PatientAttachment) {
    return (
        <Carousel className="w-full max-w-xs">
            <CarouselContent>
                {attachments.map((item, index) => (
                    <CarouselItem key={index}>
                        <div className="p-1">
                            <Card>
                                <CardContent className="flex aspect-square items-center justify-center p-6">
                                    <span className="text-4xl font-semibold">{index + 1}</span>
                                    <Image
                                        src={item?.File?.url as string}
                                        alt={item?.File?.name as string}
                                        width={576}
                                        height={20}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    )
}


const CheckupDetail: PasienPlusPage<{ id: string }> = ({ id }) => {
    const { data: report, isLoading } = api.record.getRecordById.useQuery({ id })
    const [activeSlide, setActiveSlide] = useState(0)

    if (isLoading) {
        return <div className="flex justify-center h-full items-center">
            <Spinner />
        </div>
    }

    if (!report) {
        return <div className="flex justify-center items-center">
            <h1 className="scroll-m-20 text-xl font-extrabold tracking-tight">Data pemeriksaan tidak ada</h1>
        </div>
    }

    const attachment = report?.Attachment as PatientAttachment

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
                <PatientDescription {...report?.patient as PatientInfo} />
                <div className="bg-white overflow-hidden shadow sm:rounded-lg outline outline-1 outline-slate-200">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-blue-600">Data Pemeriksaan</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Informasi detail pasien pada pemeriksaan.
                        </p>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                        <div className=" max-w-full flex flex-col gap-y-8">
                            <div className="w-full flex flex-col items-start sm:col-span-1">
                                <dt className="font-medium text-gray-500 text-sm">Komplain </dt>
                                <dd className="text-gray-900 text-sm mt-1">{report?.complaint ?? "Belum ada komplain"}</dd>
                            </div>
                            <div className="w-full flex flex-col items-start sm:col-span-1">
                                <dt className="font-medium text-gray-500 text-sm">Diagnosa </dt>
                                <dd className="text-gray-900 text-sm mt-1">{report?.diagnosis ?? "Belum ada diagnosis"}</dd>
                            </div>
                            <div className="w-full flex flex-col items-start sm:col-span-1">
                                <dt className="font-medium text-gray-500 text-sm">Pemeriksaan </dt>
                                <dd className="text-gray-900 text-sm mt-1">{report?.checkup ?? "Belum ada checkup"}</dd>
                            </div>
                            <div className="w-full flex flex-col items-start sm:col-span-1">
                                <dt className="font-medium text-gray-500 text-sm">Terapi </dt>
                                <dd className="text-gray-900 text-sm mt-1">{
                                    report.MedicineDetail.map((item, i) => (
                                        <span key={i} className="capitalize">
                                            {item.medicine.name}{i !== report.MedicineDetail.length - 1 ? ", " : ""}
                                        </span>
                                    ))

                                }</dd>
                            </div>
                            <div className="w-full flex flex-col items-start sm:col-span-1">
                                <dt className="font-medium text-gray-500 text-sm">Tindakan </dt>
                                <dd className="text-gray-900 text-sm mt-1">{report?.treatment ?? "Belum ada tindakan"}</dd>
                            </div>
                            <div className="w-full flex flex-col items-start sm:col-span-1">
                                <dt className="font-medium text-gray-500 text-sm">Catatan Dokter </dt>
                                <dd className="text-gray-900 text-sm mt-1">{report?.note ?? "Belum ada catatan dokter"}</dd>
                            </div>
                            <div className="w-full flex flex-col items-start sm:col-span-1">
                                <dt className="font-medium text-gray-500 text-sm">Catatan Lab </dt>
                                <dd className="text-gray-900 text-sm mt-1">{report?.labNote ?? "Belum ada catatan lab"}</dd>
                            </div>
                            <div className="w-full flex flex-col items-start sm:col-span-1">
                                <dt className="font-medium text-gray-500 text-sm">Nominal Pembayaran </dt>
                                <dd className="text-gray-900 text-sm mt-1">{report?.pay.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) ?? "Belum ada nominal pembayaran"}</dd>
                            </div>
                            <div className="">
                                <dt className="font-medium text-gray-500 text-sm">Foto Luka dan Hasil Lab</dt>
                                <div className="mt-1">
                                    <Carousel className="w-full max-w-xs">
                                        <CarouselContent className="-ml-1">
                                            {attachment.length !== 0 ? attachment.map((item, index) => (
                                                <CarouselItem key={index} className="pl-4">
                                                    <div className="p-1">
                                                        <Card>
                                                            <CardContent className="flex aspect-square items-center justify-center p-6">
                                                                <Image
                                                                    src={item?.File?.url as string}
                                                                    alt={item?.File?.name as string}
                                                                    width={576}
                                                                    height={20}
                                                                />
                                                            </CardContent>
                                                        </Card>
                                                    </div>
                                                </CarouselItem>
                                            )) : (
                                                <CarouselItem className="pl-4">
                                                    <div className="p-1">
                                                        <Card>
                                                            <CardContent className="flex aspect-square items-center justify-center p-6">
                                                                <ImageOffIcon className="text-gray-400" />
                                                            </CardContent>
                                                        </Card>
                                                    </div>
                                                </CarouselItem>
                                            )}
                                        </CarouselContent>
                                        <CarouselPrevious />
                                        <CarouselNext />
                                    </Carousel>
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

export async function getStaticProps(
    context: GetStaticPropsContext<{ id: string }>,
) {

    const ssg = generateSSGHelper();
    const id = context.params?.id as string;


    await ssg.record.getRecordById.prefetch({ id });

    return {
        props: {
            trpcState: ssg.dehydrate(),
            id,
        },
        revalidate: 1,
    };
}

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = await prisma.medicalRecord.findMany({
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
};

CheckupDetail.authRequired = true;

CheckupDetail.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};
