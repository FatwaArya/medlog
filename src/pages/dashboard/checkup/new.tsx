import Layout from "@/components/dashboard/Layout"
import { ReactElement, useState } from "react"
import { CameraIcon, Loader2, UserIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/router"
import Head from "next/head"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Controller, useForm, SubmitHandler } from "react-hook-form"
import { RouterInputs, api } from "@/utils/api"
import { z } from "zod"
import Attachments, { AttachmentType } from "@/components/checkup/Attachment"
import { v4 as uuidv4 } from "uuid";


type CheckupNewPatient = RouterInputs['patient']['createNewPatient']



const redAsterisk = <span className="text-red-500">*</span>


type FileAndAttachment = { file: File; attachment: AttachmentType };


const NewCheckup = () => {
    const { register, handleSubmit, control, reset } = useForm<CheckupNewPatient>()
    const { mutate, isLoading } = api.patient.createNewPatient.useMutation()
    const utils = api.useContext()
    const [previewAttachments, setPreviewAttachments] = useState<
        FileAndAttachment[]
    >([]);
    const presignedUrls = api.patient.createPresignedUrl.useQuery(
        {
            count: previewAttachments.length,
        },
        {
            enabled: previewAttachments.length > 0,
        }
    )

    const onRemoveAttachment = (attachment: AttachmentType) => {
        const newPreviewAttachments = previewAttachments.filter(
            (p) => p.attachment !== attachment
        );

        setPreviewAttachments(newPreviewAttachments);
    };
    const onFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newPreviewAttachments = [];

            for (const file of e.target.files) {
                const attachment = {
                    id: uuidv4(),
                    medicalRecordId: uuidv4(),
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

                newPreviewAttachments.push({
                    file,
                    attachment,
                });
            }

            setPreviewAttachments([
                ...previewAttachments,
                ...newPreviewAttachments,
            ]);
        }
    };

    const onSubmit: SubmitHandler<CheckupNewPatient> = async (data) => {
        const uploads: { key: string; ext: string }[] = [];

        if (previewAttachments.length && presignedUrls.data) {
            for (let i = 0; i < previewAttachments.length; i++) {
                const previewAttachment = previewAttachments[i];
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
        mutate({
            name: data.name,
            nik: data.nik.toString(),
            phone: data.phone.toString(),
            address: data.address,
            gender: data.gender,
            birthDate: data.birthDate,
            complaint: data.complaint,
            diagnosis: data.diagnosis,
            treatment: data.treatment,
            note: data.note,
            pay: data.pay,
            files: uploads,
        }, {
            onSuccess: () => {
                //reset all fields
                reset()
                setPreviewAttachments([])
                toast.success("Patient successfully created", {
                    position: "top-center"
                })
                utils.patient.getNewestPatients.invalidate()
            },
            onError: (e) => {
                if (e instanceof z.ZodError) {
                    toast.error(e.message, {
                        position: "top-center"
                    })
                } else {
                    toast.error("Something went wrong", {
                        position: "top-center"
                    })
                }
            },

        })
    }

    return (
        <>
            <Head>
                <title>Pasien Plus | Register New Patient</title>
            </Head>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-6">
                    <div >
                        <div className="md:grid md:grid-cols-3 md:gap-6">
                            <div className="md:col-span-1">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">Patient</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Isi data pasien disini dengan benar, agar pencarian data pasien lebih mudah.
                                </p>
                            </div>
                            <div className="mt-5 md:mt-0 md:col-span-2">
                                <div >
                                    <div className="grid grid-cols-6 gap-6">
                                        <div className="col-span-6 sm:col-span-3">
                                            <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                                                Patient name {redAsterisk}
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
                                            <label htmlFor="NIK" className="block text-sm font-medium text-gray-700">
                                                NIK {redAsterisk}
                                            </label>
                                            <Input
                                                type="number"
                                                id="NIK"
                                                autoComplete="NIK"
                                                className="mt-1 bg-white"
                                                {...register("nik", { required: true, maxLength: 16 })}
                                            />
                                        </div>

                                        <div className="col-span-6 sm:col-span-3">
                                            <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700">
                                                Phone number {redAsterisk}
                                            </label>
                                            <div className="mt-1 relative rounded-md shadow-sm">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500 sm:text-sm">+62</span>
                                                </div>
                                                <Input
                                                    type="number"
                                                    id="phone-number"
                                                    autoComplete="phone-number"
                                                    // className="mt-1 "
                                                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-11 pr-12 sm:text-sm border-gray-300 rounded-md bg-white"

                                                    {...register("phone", { required: true, maxLength: 13 })}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-span-6">
                                            <label htmlFor="street-address" className="block text-sm font-medium text-gray-700">
                                                Street address {redAsterisk}
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
                                            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                                                Gender {redAsterisk}
                                            </label>
                                            <Controller
                                                name="gender"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select onValueChange={field.onChange}>
                                                        <SelectTrigger className="w-full mt-1 bg-white" ref={field.ref}>
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
                                            <label htmlFor="street-address" className="block text-sm font-medium text-gray-700">
                                                Date of birth {redAsterisk}
                                            </label>
                                            <Input
                                                type="date"
                                                id="date-of-birth"
                                                autoComplete="date-of-birth"
                                                className="mt-1 bg-white"
                                                {...register("birthDate", { required: true, valueAsDate: true })}
                                            />
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div >
                        <div className="md:grid md:grid-cols-3 md:gap-6">
                            <div className="md:col-span-1">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">Check up</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Isi data pemeriksaan disini dengan benar, agar pencarian data pemeriksaan lebih mudah.
                                </p>
                            </div>
                            <div className="mt-5 md:mt-0 md:col-span-2">
                                <div className="space-y-6">
                                    <div>
                                        <label htmlFor="complaint" className="block text-sm font-medium text-gray-700">
                                            Complaint {redAsterisk}
                                        </label>
                                        <div className="mt-1">
                                            <textarea
                                                id="complaint"
                                                rows={3}
                                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                                                placeholder="Patient had slight headache, and felt dizzy"
                                                defaultValue={''}
                                                {...register("complaint", { required: true })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700">
                                            Diagnosis {redAsterisk}
                                        </label>
                                        <div className="mt-1">
                                            <textarea
                                                id="diagnosis"
                                                rows={3}
                                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                                                placeholder="Patient maybe had a migraine, and need to take paracetamol"
                                                defaultValue={''}
                                                {...register("diagnosis", { required: true })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="treatment" className="block text-sm font-medium text-gray-700">
                                            Treatment {redAsterisk}
                                        </label>
                                        <div className="mt-1">
                                            <Controller
                                                name="treatment"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select onValueChange={field.onChange}>
                                                        <SelectTrigger className="w-full bg-white" ref={field.ref}>
                                                            <SelectValue placeholder="Select drugs">
                                                                <span className="capitalize">{field.value}</span>
                                                            </SelectValue>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                <SelectItem value="paracetamol">Paracetamol</SelectItem>
                                                                <SelectItem value="ibuprofen">Ibuprofen</SelectItem>
                                                                <SelectItem value="aspirin">Aspirin</SelectItem>
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                                            Notes {redAsterisk}
                                        </label>
                                        <div className="mt-1">
                                            <textarea
                                                id="notes"
                                                rows={3}
                                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                                                placeholder='Patient need to take paracetamol 3 times a day, and need to rest for 2 days'
                                                defaultValue={''}
                                                {...register("note", { required: true })}
                                            />
                                        </div>
                                    </div>


                                    <div>
                                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                                            Fee {redAsterisk}
                                        </label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500 sm:text-sm">IDR</span>
                                            </div>
                                            <Input
                                                type="number"
                                                id="fee"
                                                min={0}
                                                {...register("pay", { required: true, valueAsNumber: true })}
                                                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-11 pr-12 sm:text-sm border-gray-300 rounded-md bg-white"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Foto luka (optional) </label>
                                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
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
                                                            className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                                                        >
                                                            <span>Upload a file</span>
                                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={onFilesChange} multiple />
                                                        </label>
                                                        <p className="pl-1">or drag and drop</p>
                                                    </div>
                                                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
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
                            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Save
                        </button>
                    </div>
                </div >
            </form >

        </>
    )
}

export default NewCheckup

NewCheckup.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>
}

NewCheckup.authRequired = true;