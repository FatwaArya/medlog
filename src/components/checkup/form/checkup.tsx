
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FileAndAttachment, createAttachment, redAsterisk, } from "@/pages/dashboard/checkup/new";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import Attachments, { type AttachmentType } from "@/components/checkup/Attachment";
import { v4 as uuidv4 } from "uuid";
import { useCheckUpAttachmentStore } from "@/store/previewAttachment";
import type { CheckupExistingPatient } from "@/pages/dashboard/checkup/[id]/new";



export function CheckupForm() {
    const { register, control } = useFormContext<CheckupExistingPatient>()
    const previewCheckUpAttachments = useCheckUpAttachmentStore((state) => state.fileAndAttachment);
    const setPreviewCheckup = useCheckUpAttachmentStore((state) => state.setFileAndAttachment);
    const removeAttachment = useCheckUpAttachmentStore((state) => state.removeFileAndAttachment);

    const onRemoveAttachment = (attachment: AttachmentType) => {
        removeAttachment(attachment);
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

            setPreviewCheckup([...previewCheckUpAttachments, ...newPreviewAttachments])
        }
    };

    return (
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
                                    {...register('complaint', { required: true })}
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="checkup"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Pemeriksaan {redAsterisk}
                            </label>
                            <div className="mt-1">
                                <textarea
                                    id="checkup"
                                    rows={3}
                                    className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    placeholder="Patient maybe had a migraine, and need to take paracetamol"
                                    defaultValue={""}
                                    {...register('checkup', { required: true })}
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
                                htmlFor="fee"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Diagnosis {redAsterisk}
                            </label>

                            <Input
                                type="text"
                                id="diagnosis"
                                {...register('diagnosis', {
                                    required: true,
                                })}
                                placeholder="Open Wound"
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="fee"
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
                                {previewCheckUpAttachments.length > 0 ? (
                                    <div className="mt-3.5 grid gap-2">
                                        <Attachments
                                            attachments={previewCheckUpAttachments.map(
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

    )
}