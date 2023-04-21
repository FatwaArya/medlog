import Layout from "@/components/dashboard/Layout";
import { type ReactElement, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import Head from "next/head";
import toast from "react-hot-toast";
import { useForm, type SubmitHandler, FormProvider } from "react-hook-form";
import { type RouterInputs, api } from "@/utils/api";
import { type AttachmentType } from "@/components/checkup/Attachment";
import { v4 as uuidv4 } from "uuid";
import { PatientInfoForm } from "@/components/checkup/form/patientInfo";
import { CheckupForm } from "@/components/checkup/form/checkup";
import { useCheckUpAttachmentStore, useLabsAttachmentStore } from "@/store/previewAttachment";
import { LabForm } from "@/components/checkup/form/lab";

export const redAsterisk = <span className="text-red-500">*</span>;

export type FileAndAttachment = { file: File; attachment: AttachmentType };

type CheckupNewPatient = RouterInputs["patient"]["createNewPatient"]

export const createAttachment = (file: File, medicalRecordId: string) => {
    return {
        id: uuidv4(),
        medicalRecordId,
        fileId: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
        File: {
            id: uuidv4(),
            type: "IMAGE",
            url: URL.createObjectURL(file),
            mime: file.type,
            name: file.name,
            extension: file.name.split(".").pop() as string,
            size: file.size,
            height: null,
            width: null,
            createdAt: new Date(),
        },
    };
};
const NewCheckup = () => {
    // { register, handleSubmit, control, reset }
    const methods = useForm<CheckupNewPatient>();
    const { mutate, isLoading } = api.patient.createNewPatient.useMutation();
    const utils = api.useContext();
    const previewCheckUpAttachments = useCheckUpAttachmentStore((state) => state.fileAndAttachment);
    const clearPreviewCheckUpAttachments = useCheckUpAttachmentStore((state) => state.clearFileAndAttachment);
    const previewLabAttachments = useLabsAttachmentStore((state) => state.fileAndAttachment);
    const clearPreviewLabAttachments = useLabsAttachmentStore((state) => state.clearFileAndAttachment);


    const [allPreviewAttachments, setAllPreviewAttachments] = useState<
        FileAndAttachment[]
    >([]);

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



    const onSubmit: SubmitHandler<CheckupNewPatient> = async (data) => {
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
                name: data.name,
                phone: data.phone,
                address: data.address,
                gender: data.gender,
                birthDate: data.birthDate,
                complaint: data.complaint,
                diagnosis: data.diagnosis,
                treatment: data.treatment,
                note: data.note,
                pay: data.pay,
                //merge attachments
                files: uploads,
                labNote: data.labNote,
            },
            {
                onSuccess: () => {
                    //reset all fields
                    methods.reset();
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

    return (
        <>
            <Head>
                <title>Pasien Plus | Register New Patient</title>
            </Head>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                    <div className="space-y-6">
                        <PatientInfoForm />
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
        </>
    );
};

export default NewCheckup;

NewCheckup.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

NewCheckup.authRequired = true;
