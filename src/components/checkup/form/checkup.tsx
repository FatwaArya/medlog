
import { Input } from "@/components/ui/input";
import { createAttachment, redAsterisk, } from "@/pages/dashboard/checkup/new";
import { Controller, useFormContext } from "react-hook-form";
import Attachments, { type AttachmentType } from "@/components/checkup/Attachment";
import { v4 as uuidv4 } from "uuid";
import { useCheckUpAttachmentStore } from "@/store/previewAttachment";
import type { CheckupExistingPatient } from "@/pages/dashboard/checkup/[id]/new";
import CreatableSelect from 'react-select/creatable';
import { api } from "@/utils/api";
import { NumericFormat } from "react-number-format";


export function CheckupForm() {
    const { register, control } = useFormContext<CheckupExistingPatient>()
    const previewCheckUpAttachments = useCheckUpAttachmentStore((state) => state.fileAndAttachment);
    const setPreviewCheckup = useCheckUpAttachmentStore((state) => state.setFileAndAttachment);
    const removeAttachment = useCheckUpAttachmentStore((state) => state.removeFileAndAttachment);
    const { mutate, isLoading } = api.medicine.create.useMutation()
    const utils = api.useContext()
    const { data: medicineOptions } = api.medicine.gets.useQuery()



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

    const handleCreate = async (inputValue: string) => {
        mutate({ name: inputValue }, {
            onSuccess: () => {
                utils.medicine.gets.invalidate()
            }
        })
    }


    return (
        <div>
            <div className="bg-white overflow-hidden sm:rounded-lg outline outline-1 outline-slate-200 mb-4 rounded-sm">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-blue-600">Data Checkup</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Isi data pasien disini dengan benar, agar pencarian data
                        pasien lebih mudah.
                    </p>
                </div>
                <div className="px-4 pb-6 pt-1 sm:pt-5 sm:px-6">
                    <div className="md:grid md:grid-cols-1 md:gap-6">
                        <div className="mt-5 md:col-span-2 md:mt-0">
                            <div>
                                <div className="grid grid-cols-6 gap-6">
                                    <div className="col-span-6">
                                        <label
                                            htmlFor="complaint"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Keluhan Pasien {redAsterisk}
                                        </label>
                                        <div className="mt-1">
                                            <textarea
                                                id="complaint"
                                                rows={3}
                                                className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                placeholder='Masukkan keluhan pasien'
                                                defaultValue={""}
                                                {...register('complaint', { required: true })}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-span-6 sm:col-span-3">
                                        <label
                                            htmlFor="treatment"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Terapi
                                        </label>
                                        <div className="mt-1">
                                            <Controller
                                                name='treatment'
                                                control={control}
                                                render={({ field }) => (
                                                    <CreatableSelect
                                                        {...field}
                                                        isMulti
                                                        placeholder="Pilih obat"
                                                        isDisabled={isLoading}
                                                        isLoading={isLoading}
                                                        onChange={(value) => field.onChange(value)}
                                                        onCreateOption={handleCreate}
                                                        value={field.value}
                                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                        // @ts-ignore
                                                        options={medicineOptions}
                                                        styles={{
                                                            input: (base) => ({
                                                                ...base,
                                                                'input:focus': {
                                                                    boxShadow: 'none',
                                                                },
                                                            }),
                                                        }}
                                                        formatCreateLabel={(inputValue) => `Tambahkan obat "${inputValue}"`}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-span-6 sm:col-span-3">
                                        <label
                                            htmlFor="fee"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Biaya {redAsterisk}
                                        </label>
                                        <div className="relative mt-1 rounded-md shadow-sm">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <span className="text-gray-500 sm:text-sm">IDR</span>
                                            </div>
                                            <Controller
                                                name='pay'
                                                control={control}
                                                render={({ field }) => (
                                                    <NumericFormat
                                                        customInput={Input}
                                                        thousandSeparator={true}
                                                        onValueChange={(values) => {
                                                            field.onChange(values.floatValue)
                                                        }}
                                                        className="block w-full rounded-md border-gray-300 bg-white pl-10 pr-12 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                        defaultValue="20000"
                                                        name={field.name}
                                                        value={field.value}
                                                        onBlur={field.onBlur}
                                                        getInputRef={field.ref}
                                                    />
                                                )}
                                            />

                                        </div>
                                    </div>

                                    <div className="col-span-6 sm:col-span-3">
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
                                                placeholder='Masukkan pemeriksaan pasien'
                                                defaultValue={""}
                                                {...register('checkup', { required: true })}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-span-6 sm:col-span-3">
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
                                                placeholder="Masukkan catatan"
                                                defaultValue={""}
                                                {...register("note", { required: true })}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-span-6">
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
                                            placeholder="Masukkan diagnosis"
                                            className="mt-1"
                                        />
                                    </div>

                                    <div className="col-span-6">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Foto luka {" "}
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
                </div>
            </div>
        </div>

    )
}