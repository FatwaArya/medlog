import Layout from "@/components/dashboard/Layout";
import { type ReactElement, useEffect, useState, useRef } from "react";
import { Loader2 } from "lucide-react";
import Head from "next/head";
import toast from "react-hot-toast";

import { useForm, type SubmitHandler, FormProvider } from "react-hook-form";
import { type RouterInputs, api, type RouterOutputs } from "@/utils/api";
import { CheckupForm } from "@/components/checkup/form/checkup";
import {
    useCheckUpAttachmentStore,
    useLabsAttachmentStore,
} from "@/store/previewAttachment";
import { LabForm } from "@/components/checkup/form/lab";
import { type PasienPlusPage } from "@/pages/_app";
import { type FileAndAttachment } from "../new";

import { Spinner } from "@/components/ui/loading-overlay";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/utils/cn";

export type CheckupExistingPatient =
    RouterInputs["patient"]["createMedicalRecord"];
type PatientInfo = RouterOutputs["patient"]["getPatientById"];

export const PatientDescription = (props: PatientInfo) => {
    return (
        <>
            <div className="mb-4 overflow-hidden rounded-sm bg-white shadow outline outline-1 outline-slate-200 sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg font-medium leading-6 text-blue-600">
                        Informasi Pasien
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Informasi dasar pasien pada pemeriksaan.
                    </p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">
                                Nama Lengkap
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">{props?.name}</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">
                                Nomor Telefon
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                {props?.phone ?? "Tidak ada nomor telepon"}
                            </dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Alamat</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                {props?.address ?? "Tidak ada alamat"}
                            </dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">
                                Tanggal lahir
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                {dayjs(props?.birthDate).format("DD MMMM YYYY") ??
                                    "Tidak ada tanggal lahir"}
                            </dd>
                        </div>

                    </dl>
                </div>
            </div>
        </>
    );
};

const ContinueCheckup: PasienPlusPage<{ id: string }> = () => {
    const { id } = useRouter().query;
    const { data: patient, isLoading: isLoadingPatient } =
        api.patient.getPatientById.useQuery({ patientId: id as string });

    const methods = useForm<CheckupExistingPatient>({
        defaultValues: {
            complaint: "",
            diagnosis: "",
            note: "",
            treatment: "",
            checkup: "",
            drugs: [],
            pay: 0,
            files: [],
            labNote: "",
        },
    });

    const { mutate, isLoading } = api.patient.createMedicalRecord.useMutation();
    const utils = api.useContext();

    const previewCheckUpAttachments = useCheckUpAttachmentStore(
        (state) => state.fileAndAttachment
    );
    const clearPreviewCheckUpAttachments = useCheckUpAttachmentStore(
        (state) => state.clearFileAndAttachment
    );
    const previewLabAttachments = useLabsAttachmentStore(
        (state) => state.fileAndAttachment
    );
    const clearPreviewLabAttachments = useLabsAttachmentStore(
        (state) => state.clearFileAndAttachment
    );

    const [allPreviewAttachments, setAllPreviewAttachments] = useState<
        FileAndAttachment[]
    >([]);

    const sumbitRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        setAllPreviewAttachments([
            ...previewCheckUpAttachments,
            ...previewLabAttachments,
        ]);
    }, [previewCheckUpAttachments, previewLabAttachments]);


    const presignedUrls = api.patient.createPresignedUrl.useQuery(
        {
            count: allPreviewAttachments.length,
        },
        {
            enabled: allPreviewAttachments.length > 0,
        }
    );

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
                patientId: id as string,
                complaint: data.complaint,
                diagnosis: data.diagnosis,
                note: data.note,
                treatment: data.treatment,
                checkup: data.checkup,
                drugs: data.drugs,
                pay: data.pay,
                files: uploads,
                labNote: data.labNote,
            },
            {
                onSuccess: () => {
                    //reset all
                    methods.reset();

                    clearPreviewCheckUpAttachments();
                    clearPreviewLabAttachments();
                    toast.success("Pemeriksaan Pasien Berhasil!", {
                        position: "top-center",
                    });
                    utils.patient.getNewestPatients.invalidate();
                },
                onError: (e) => {
                    const errorMessage = e.data?.zodError?.fieldErrors.phone;
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
                                    ref={sumbitRef}
                                    type="submit"
                                />
                                <AlertDialog>
                                    <AlertDialogTrigger
                                        //change button color when loading

                                        className={cn(
                                            "ml-3 inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                                            isLoading && "bg-blue-400"
                                        )}
                                        disabled={isLoading} >
                                        {isLoading ? (
                                            <div className="flex justify-center items-center">
                                                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Simpan
                                            </div>
                                        ) : (
                                            "Simpan"
                                        )}
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Apakah anda yakin?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription className="line-clamp-4">
                                                Tindakan ini permanen dan tidak dapat diubah. Mohon pastikan informasi yang dimasukkan akurat. Jika perlu bantuan, hubungi tim dukungan kami.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>


                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction className="bg-blue-600 hover:bg-blue-400" onClick={() => {
                                                sumbitRef.current?.click();
                                            }}>

                                                Simpan
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    </form>
                </FormProvider>
            </main>
        </>
    );
};
export default ContinueCheckup;



ContinueCheckup.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

ContinueCheckup.authRequired = true;
