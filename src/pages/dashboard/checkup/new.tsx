import Layout from "@/components/dashboard/Layout";
import { ReactElement, useEffect, useState } from "react";
import { CameraIcon, Loader2, UserIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/router";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import { RouterInputs, api } from "@/utils/api";
import { z } from "zod";
import Attachments, { AttachmentType } from "@/components/checkup/Attachment";
import { v4 as uuidv4 } from "uuid";

type CheckupNewPatient = RouterInputs["patient"]["createNewPatient"];

const redAsterisk = <span className="text-red-500">*</span>;

type FileAndAttachment = { file: File; attachment: AttachmentType };

const createAttachment = (file: File, medicalRecordId: string) => {
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

const removeAttachment = (
    attachment: AttachmentType,
    attachments: Array<{ file: File; attachment: AttachmentType }>,
    setAttachments: React.Dispatch<
        React.SetStateAction<Array<{ file: File; attachment: AttachmentType }>>
    >
) => {
    const newAttachments = attachments.filter((p) => p.attachment !== attachment);
    setAttachments(newAttachments);
};

const NewCheckup = () => {
    const { register, handleSubmit, control, reset } =
        useForm<CheckupNewPatient>();
    const { mutate, isLoading } = api.patient.createNewPatient.useMutation();
    const utils = api.useContext();
    const [previewAttachments, setPreviewAttachments] = useState<
        FileAndAttachment[]
    >([]);
    const [previewLabAttachments, setPreviewLabAttachments] = useState<
        FileAndAttachment[]
    >([]);
    const [allPreviewAttachments, setAllPreviewAttachments] = useState<
        FileAndAttachment[]
    >([]);

    useEffect(() => {
        setAllPreviewAttachments([...previewAttachments, ...previewLabAttachments]);
    }, [previewAttachments, previewLabAttachments]);

    const presignedUrls = api.patient.createPresignedUrl.useQuery(
        {
            count: allPreviewAttachments.length,
        },
        {
            enabled: allPreviewAttachments.length > 0,
        }
    );

    const onRemoveAttachment = (attachment: AttachmentType) => {
        removeAttachment(attachment, previewAttachments, setPreviewAttachments);
    };

    const onRemoveLabAttachment = (attachment: AttachmentType) => {
        removeAttachment(attachment, previewLabAttachments, setPreviewLabAttachments);
    };

    const onFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newPreviewAttachments = [];

            for (const file of e.target.files) {
                const attachment = createAttachment(file, uuidv4());

                newPreviewAttachments.push({
                    file,
                    attachment,
                });
            }

            setPreviewAttachments([...previewAttachments, ...newPreviewAttachments]);
        }
    };

    const onLabFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newPreviewLabAttachments = [];

            for (const file of e.target.files) {
                const attachment = createAttachment(file, uuidv4());

                newPreviewLabAttachments.push({
                    file,
                    attachment,
                });
            }

            setPreviewLabAttachments([
                ...previewLabAttachments,
                ...newPreviewLabAttachments,
            ]);
        }
    };

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
                phone: data.phone.toString(),
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
                    reset()
                    setPreviewAttachments([])
                    setPreviewLabAttachments([])
                    toast.success("Patient successfully created", {
                        position: "top-center",
                    });
                    utils.patient.getNewestPatients.invalidate();
                },
                onError: (e) => {
                    if (e instanceof z.ZodError) {
                        toast.error(e.message, {
                            position: "top-center",
                        });
                    } else {
                        toast.error("Something went wrong", {
                            position: "top-center",
                        });
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
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-6">
                    <div>
                        <div className="md:grid md:grid-cols-3 md:gap-6">
                            <div className="md:col-span-1">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    Patient
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Isi data pasien disini dengan benar, agar pencarian data
                                    pasien lebih mudah.
                                </p>
                            </div>
                            <div className="mt-5 md:col-span-2 md:mt-0">
                                <div>
                                    <div className="grid grid-cols-6 gap-6">
                                        <div className="col-span-6 sm:col-span-3">
                                            <label
                                                htmlFor="first-name"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Nama pasien {redAsterisk}
                                            </label>
                                            <Input
                                                type="text"
                                                id="first-name"
                                                autoComplete="given-name"
                                                className="mt-1 bg-white"
                                                {...register("name", { required: true })}
                                            />
                                        </div>

                                        <div className="col-span-6 sm:col-span-3">
                                            <label
                                                htmlFor="phone-number"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Nomor telfon {redAsterisk}
                                            </label>
                                            <div className="relative mt-1 rounded-md shadow-sm">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <span className="text-gray-500 sm:text-sm">+62</span>
                                                </div>
                                                <Input
                                                    type="number"
                                                    id="phone-number"
                                                    autoComplete="phone-number"
                                                    // className="mt-1 "
                                                    className="block w-full rounded-md border-gray-300 bg-white pl-11 pr-12 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                    {...register("phone", {
                                                        required: true,
                                                        maxLength: 13,
                                                        valueAsNumber: true,
                                                    })}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-span-6">
                                            <label
                                                htmlFor="street-address"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Alamat Rumah {redAsterisk}
                                            </label>
                                            <Input
                                                type="text"
                                                id="street-address"
                                                autoComplete="street-address"
                                                className="mt-1 bg-white"
                                                {...register("address", { required: true })}
                                            />
                                        </div>

                                        <div className="col-span-6">
                                            <label
                                                htmlFor="gender"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Jenis kelamin {redAsterisk}
                                            </label>
                                            <Controller
                                                name="gender"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select onValueChange={field.onChange}>
                                                        <SelectTrigger
                                                            className="mt-1 w-full bg-white"
                                                            ref={field.ref}
                                                        >
                                                            <SelectValue placeholder="Select gender" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                <SelectItem value="male">Male</SelectItem>
                                                                <SelectItem value="female">Female</SelectItem>
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                        </div>

                                        <div className="col-span-6">
                                            <label
                                                htmlFor="street-address"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Tanggal lahir {redAsterisk}
                                            </label>
                                            <Input
                                                type="date"
                                                id="date-of-birth"
                                                autoComplete="date-of-birth"
                                                className="mt-1 bg-white"
                                                {...register("birthDate", {
                                                    required: true,
                                                    valueAsDate: true,
                                                })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="md:grid md:grid-cols-3 md:gap-6">
                            <div className="md:col-span-1">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    Check up
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Isi data pemeriksaan disini dengan benar, agar pencarian data
                                    pemeriksaan lebih mudah.
                                </p>
                            </div>
                            <div className="mt-5 md:col-span-2 md:mt-0">
                                <div className="space-y-6">
                                    <div>
                                        <label
                                            htmlFor="complaint"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Komplain {redAsterisk}
                                        </label>
                                        <div className="mt-1">
                                            <textarea
                                                id="complaint"
                                                rows={3}
                                                className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                placeholder="Patient had slight headache, and felt dizzy"
                                                defaultValue={""}
                                                {...register("complaint", { required: true })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="diagnosis"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Diagnosis {redAsterisk}
                                        </label>
                                        <div className="mt-1">
                                            <textarea
                                                id="diagnosis"
                                                rows={3}
                                                className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                placeholder="Patient maybe had a migraine, and need to take paracetamol"
                                                defaultValue={""}
                                                {...register("diagnosis", { required: true })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="treatment"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Terapi {redAsterisk}
                                        </label>
                                        <div className="mt-1">
                                            <Controller
                                                name="treatment"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select onValueChange={field.onChange}>
                                                        <SelectTrigger
                                                            className="w-full bg-white"
                                                            ref={field.ref}
                                                        >
                                                            <SelectValue placeholder="Select drugs" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                <SelectItem value="paracetamol">
                                                                    Paracetamol
                                                                </SelectItem>
                                                                <SelectItem value="ibuprofen">
                                                                    Ibuprofen
                                                                </SelectItem>
                                                                <SelectItem value="aspirin">Aspirin</SelectItem>
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="notes"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Catatan {redAsterisk}
                                        </label>
                                        <div className="mt-1">
                                            <textarea
                                                id="notes"
                                                rows={3}
                                                className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                placeholder="Patient need to take paracetamol 3 times a day, and need to rest for 2 days"
                                                defaultValue={""}
                                                {...register("note", { required: true })}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="notes"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Fee {redAsterisk}
                                        </label>
                                        <div className="relative mt-1 rounded-md shadow-sm">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <span className="text-gray-500 sm:text-sm">IDR</span>
                                            </div>
                                            <Input
                                                type="number"
                                                id="fee"
                                                min={0}
                                                {...register("pay", {
                                                    required: true,
                                                    valueAsNumber: true,
                                                })}
                                                className="block w-full rounded-md border-gray-300 bg-white pl-11 pr-12 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Foto luka (optional){" "}
                                        </label>
                                        <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pb-6 pt-5">
                                            {previewAttachments.length > 0 ? (
                                                <div className="mt-3.5 grid gap-2">
                                                    <Attachments
                                                        attachments={previewAttachments.map(
                                                            (attachment) => attachment.attachment
                                                        )}
                                                        onRemoveAttachment={onRemoveAttachment}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="space-y-1 text-center">
                                                    <svg
                                                        className="mx-auto h-12 w-12 text-gray-400"
                                                        stroke="currentColor"
                                                        fill="none"
                                                        viewBox="0 0 48 48"
                                                        aria-hidden="true"
                                                    >
                                                        <path
                                                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                            strokeWidth={2}
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                    <div className="flex text-sm text-gray-600">
                                                        <label
                                                            htmlFor="file-upload"
                                                            className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-blue-500"
                                                        >
                                                            <span>Upload a file</span>
                                                            <input
                                                                id="file-upload"
                                                                name="file-upload"
                                                                type="file"
                                                                className="sr-only"
                                                                //only accept image files
                                                                accept="image/*"
                                                                onChange={onFilesChange}
                                                                multiple
                                                            />
                                                        </label>
                                                        <p className="pl-1">or drag and drop</p>
                                                    </div>
                                                    <p className="text-xs text-gray-500">
                                                        PNG, JPG, GIF up to 10MB
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="md:grid md:grid-cols-3 md:gap-6">
                            <div className="md:col-span-1">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    Hasil Lab
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Isi data lab jika ada, jika tidak ada biarkan kosong
                                </p>
                            </div>
                            <div className="mt-5 md:col-span-2 md:mt-0">
                                <div className="space-y-6">
                                    <div>
                                        <label
                                            htmlFor="notes"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Catatan lab
                                        </label>
                                        <div className="mt-1">
                                            <textarea
                                                id="notes"
                                                rows={3}
                                                className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                placeholder="Patient need to take paracetamol 3 times a day, and need to rest for 2 days"
                                                defaultValue={""}
                                                {...register("labNote")}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Foto hasil lab
                                        </label>
                                        <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pb-6 pt-5">
                                            {previewLabAttachments.length > 0 ? (
                                                <div className="mt-3.5 grid gap-2">
                                                    <Attachments
                                                        attachments={previewLabAttachments.map(
                                                            (attachment) => attachment.attachment
                                                        )}
                                                        onRemoveAttachment={onRemoveLabAttachment}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="space-y-1 text-center">
                                                    <svg
                                                        className="mx-auto h-12 w-12 text-gray-400"
                                                        stroke="currentColor"
                                                        fill="none"
                                                        viewBox="0 0 48 48"
                                                        aria-hidden="true"
                                                    >
                                                        <path
                                                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                            strokeWidth={2}
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                    <div className="flex text-sm text-gray-600">
                                                        <label
                                                            htmlFor="lab-upload"
                                                            className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-blue-500"
                                                        >
                                                            <span>Upload a file</span>
                                                            <input
                                                                id="lab-upload"
                                                                name="lab-upload"
                                                                type="file"
                                                                className="sr-only"
                                                                multiple
                                                                //accpet pdf files and images
                                                                accept="image/*, application/pdf"
                                                                onChange={onLabFilesChange}
                                                            />
                                                        </label>
                                                        <p className="pl-1">or drag and drop</p>
                                                    </div>
                                                    <p className="text-xs text-gray-500">PDF</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Cancel
                        </button>
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
        </>
    );
};

export default NewCheckup;

NewCheckup.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

NewCheckup.authRequired = true;
