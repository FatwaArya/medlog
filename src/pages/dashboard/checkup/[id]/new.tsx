import Layout from "@/components/dashboard/Layout";
import { type ReactElement, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import Head from "next/head";
import toast from "react-hot-toast";

import { useForm, type SubmitHandler, FormProvider } from "react-hook-form";
import { type RouterInputs, api, type RouterOutputs } from "@/utils/api";
import { CheckupForm } from "@/components/checkup/form/checkup";
import { useCheckUpAttachmentStore, useLabsAttachmentStore } from "@/store/previewAttachment";
import { LabForm } from "@/components/checkup/form/lab";
import { type PasienPlusPage } from "@/pages/_app";
import { type FileAndAttachment } from "../new";

import { type GetStaticPropsContext, type GetStaticPaths } from 'next';
import { prisma } from "@/server/db";
import { Spinner } from "@/components/ui/loading-overlay";
import dayjs from "dayjs";
import { generateSSGHelper } from "@/server/api/helpers/ssgHelper";


export type CheckupExistingPatient = RouterInputs["patient"]['createMedicalRecord'];
type PatientInfo = RouterOutputs["patient"]["getPatientById"];


export const PatientDescription = (
    props: PatientInfo
) => {

    return (
        <>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg outline outline-1 outline-slate-200 mb-4 rounded-sm">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-blue-600">Informasi Pasien</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Informasi dasar pasien pada pemeriksaan.
                    </p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Nama Lengkap</dt>
                            <dd className="mt-1 text-sm text-gray-900">{props?.name}</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Nomor Telefon</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{
                                props?.phone ?? "Tidak ada nomor telepon"
                            }</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Alamat</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{
                                props?.address ?? "Tidak ada alamat"
                            }</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Tanggal lahir</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{
                                dayjs(props?.birthDate).format("DD MMMM YYYY") ?? "Tidak ada tanggal lahir"
                            }</dd>
                        </div>
                        {/* <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-gray-500">About</dt>
                            <dd className="mt-1 text-sm text-gray-900">
                                Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim incididunt cillum culpa consequat. Excepteur
                                qui ipsum aliquip consequat sint. Sit id mollit nulla mollit nostrud in ea officia proident. Irure nostrud
                                pariatur mollit ad adipisicing reprehenderit deserunt qui eu.
                            </dd>
                        </div> */}

                    </dl>
                </div>
            </div>

        </>

    )
}


const ContinueCheckup: PasienPlusPage<{ id: string }> = ({ id }) => {
    const { data: patient, isLoading: isLoadingPatient } = api.patient.getPatientById.useQuery({ patientId: id });


    const methods = useForm<CheckupExistingPatient>();

    const { mutate, isLoading } = api.patient.createMedicalRecord.useMutation();
    const utils = api.useContext();


    const previewCheckUpAttachments = useCheckUpAttachmentStore((state) => state.fileAndAttachment);
    const clearPreviewCheckUpAttachments = useCheckUpAttachmentStore((state) => state.clearFileAndAttachment);
    const previewLabAttachments = useLabsAttachmentStore((state) => state.fileAndAttachment);
    const clearPreviewLabAttachments = useLabsAttachmentStore((state) => state.clearFileAndAttachment);

    const [allPreviewAttachments, setAllPreviewAttachments] = useState<FileAndAttachment[]>([]);

    useEffect(() => {
        setAllPreviewAttachments([...previewCheckUpAttachments, ...previewLabAttachments]);
    }, [previewCheckUpAttachments, previewLabAttachments]);

    const presignedUrls = api.patient.createPresignedUrl.useQuery(
        {
            count: allPreviewAttachments.length,
        },
        {
            enabled: allPreviewAttachments.length > 0,
        }
    );

    console.log(allPreviewAttachments)

    const onSubmit: SubmitHandler<CheckupExistingPatient> = async (data) => {
        const uploads: { key: string; ext: string }[] = [];

        if (allPreviewAttachments.length && presignedUrls.data) {
            for (let i = 0; i < allPreviewAttachments.length; i++) {
                const previewAttachment = allPreviewAttachments[i];
                const data = presignedUrls.data[i];

                if (previewAttachment && data && data.key && data.url) {
                    const { attachment, file } = previewAttachment;

                    await fetch(data.url, {
                        method: "PUT",
                        body: file,
                    });

                    uploads.push({
                        key: data.key,
                        ext: attachment.File?.extension as string,
                    });
                }
            }
        }

        mutate(
            {
                patientId: id,
                complaint: data.complaint,
                diagnosis: data.diagnosis,
                note: data.note,
                checkup: data.checkup,
                treatment: data.treatment,
                pay: data.pay,
                files: uploads,
                labNote: data.labNote,
            },
            {
                onSuccess: () => {
                    //reset all fields
                    methods.reset();
                    methods.resetField('treatment')
                    clearPreviewCheckUpAttachments()
                    clearPreviewLabAttachments()
                    toast.success("Patient successfully created", {
                        position: "top-center",
                    });
                    utils.patient.getNewestPatients.invalidate();
                },
                onError: (e) => {
                    const errorMessage = e.data?.zodError?.fieldErrors.phone
                    if (errorMessage && errorMessage[0]) {
                        toast.error(errorMessage[0]);
                    } else {
                        toast.error(e.message);
                    }
                },
            }
        );
    };
    if (isLoadingPatient) {
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
                <title>Pasien Plus | Periksa Pasien {patient?.name}</title>
            </Head>
            <main>

                <PatientDescription {...patient} />
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)}>
                        <div className="space-y-6">
                            <CheckupForm />
                            <LabForm />

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        "Save"
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </FormProvider>
            </main>
        </>
    )
}
export default ContinueCheckup


export async function getStaticProps(
    context: GetStaticPropsContext<{ id: string }>,
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
};




ContinueCheckup.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>
}

ContinueCheckup.authRequired = true;