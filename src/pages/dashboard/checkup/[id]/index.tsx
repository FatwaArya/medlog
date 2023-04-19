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
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import {ImageOffIcon} from "lucide-react"

type PatientInfo = NonNullable<RouterOutputs["record"]['getRecordById']>['patient']

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
    console.log(report);

    const attachment = report?.Attachment;

    function goToPrevSlide (){
        setActiveSlide((activeSlide - 1 + attachment.length) % attachment.length);
    }

    function goToNextSlide (){
        setActiveSlide((activeSlide + 1) % attachment.length);
    }

    return (
        <>
            <Head>
                <title>Pasien Plus | Detail Pemeriksaan {report?.patient.name}</title>
            </Head>
            <div>
                <PatientDescription {...report?.patient as PatientInfo} />
                <div className="bg-white overflow-hidden shadow sm:rounded-lg outline outline-1 outline-slate-200">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Detail Pemeriksaan</h3>
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
                                    <dt className="font-medium text-gray-500 text-sm">Checkup </dt>
                                    <dd className="text-gray-900 text-sm mt-1">{report?.checkup ?? "Belum ada checkup"}</dd>
                                </div>
                                <div className="w-full flex flex-col items-start sm:col-span-1">
                                    <dt className="font-medium text-gray-500 text-sm">Perawatan </dt>
                                    <dd className="text-gray-900 text-sm mt-1">{report?.treatment ?? "Belum ada perawatan"}</dd>
                                </div>
                                <div className="w-full flex flex-col items-start sm:col-span-1">
                                    <dt className="font-medium text-gray-500 text-sm">Catatan Lab </dt>
                                    <dd className="text-gray-900 text-sm mt-1">{report?.labNote ?? "Belum ada catatan lab"}</dd>
                                </div>
                                <div className="w-full flex flex-col items-start sm:col-span-1">
                                    <dt className="font-medium text-gray-500 text-sm">Nominal Pembayaran </dt>
                                    <dd className="text-gray-900 text-sm mt-1">{report?.pay.toLocaleString('id-ID',  { style: 'currency', currency: 'IDR' }) ?? "Belum ada nominal pembayaran"}</dd>
                                </div>
                                <div className="w-full flex flex-col items-start sm:col-span-1">
                                    <dt className="font-medium text-gray-500 text-sm">Foto Luka </dt>
                                    <div className="flex flex-col items-center justify-start mt-1">
                                            {attachment.length !== 0 ? attachment.map((item, i) => (
                                                <div 
                                                    key={i}
                                                    className={`${
                                                        i === activeSlide
                                                        ? "opacity-100 z-10"
                                                        : "opacity-0 z-0 absolute"
                                                    } transition-opacity duration-500 ease-in-out w-full max-w-sm rounded-sm border p-2 border-gray-200`}
                                                >
                                                    <div className="relative">
                                                        <Image 
                                                            src={item?.File?.url as string }
                                                            alt={item?.File?.name as string}
                                                            width={576}
                                                            height={20}
                                                            className="rounded-sm max-h-52 h-full object-cover hover:brightness-75 cursor-pointer"
                                                        />
                                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                                <Dialog>
                                                                    <DialogTrigger>
                                                                        <Button size="sm" variant="solidWhite">Lihat Detail</Button>
                                                                    </DialogTrigger>
                                                                        <DialogContent className="min-w-[1200px] w-full ">
                                                                            <DialogHeader>
                                                                                <DialogTitle>Attachment Detail</DialogTitle>
                                                                            </DialogHeader>
                                                                            {isLoading 
                                                                                ? <div className="flex h-full justify-center items-center"><Spinner/></div> 
                                                                                : (
                                                                                <Image 
                                                                                    src={item?.File?.url as string }
                                                                                    alt={item?.File?.name as string} 
                                                                                    width={1280} 
                                                                                    height={20}
                                                                                    quality={100}
                                                                                    className="max-h-[800px] object-cover h-full overflow-y-scroll"
                                                                                /> )
                                                                            }
                                                                        </DialogContent>
                                                                </Dialog>
                                                            </div>
                                                    </div>
                                                </div>
                                            )) : (
                                                <div className="w-[576px] rounded-sm border p-2 flex justify-center items-center border-gray-200 h-[208px]">
                                                    <div className="flex flex-col items-center gap-4">
                                                        <ImageOffIcon className="text-gray-400" />
                                                        <p className="text-sm text-gray-400 font-medium">Belum ada foto luka</p>
                                                    </div>
                                                </div>
                                            )}
                                        {attachment.length !== 0 && (
                                            <div className="flex w-full items-center justify-between mt-3">
                                                <Button size="sm" variant="ghost" onClick={goToPrevSlide}>Prev</Button>
                                                <p className="text-sm font-medium text-gray-600">{activeSlide + 1} / {attachment.length}</p>
                                                <Button size="sm" variant="ghost" onClick={goToNextSlide}>Next</Button>
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
