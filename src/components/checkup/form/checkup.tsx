
import { Input } from "@/components/ui/input";
import { redAsterisk, } from "@/pages/dashboard/patients/checkup/new";
import { Controller, useFormContext } from "react-hook-form";
import { useCheckUpAttachmentStore } from "@/store/previewAttachment";
import type { CheckupExistingPatient } from "@/pages/dashboard/patients/checkup/[id]/new";
import CreatableSelect from 'react-select/creatable';
import { api } from "@/utils/api";
import { NumericFormat } from "react-number-format";
import { Label } from "@/components/ui/label";
import { type OptionProps, components } from "react-select";
import { XIcon } from "lucide-react";
import UploadDropzone from "@/components/ui/upload-dropzone";



export function CheckupForm() {
    const { register, control, formState: { errors } } = useFormContext<CheckupExistingPatient>()
    const previewCheckUpAttachments = useCheckUpAttachmentStore((state) => state.fileAndAttachment);
    const setPreviewCheckup = useCheckUpAttachmentStore((state) => state.setFileAndAttachment);
    const removeAttachment = useCheckUpAttachmentStore((state) => state.removeFileAndAttachment);
    const { mutate, isLoading } = api.medicine.create.useMutation()
    const { mutate: deleteMedicine, } = api.medicine.delete.useMutation()
    const utils = api.useContext()
    const { data: medicineOptions } = api.medicine.gets.useQuery()
    const medicineOptionsId = medicineOptions?.map((medicine) => medicine.value) ?? []

    const { data: isMedicineRelated } = api.medicine.isMedicineRelatedToRecord.useQuery({ id: medicineOptionsId })


    const handleCreate = async (inputValue: string) => {
        mutate({ name: inputValue }, {
            onSuccess: () => {
                utils.medicine.gets.invalidate()
            }
        })
    }

    const Option = (props: OptionProps<{ value: string; label: string; }, true>) => {
        const { data } = props;
        //if data is match each isMedicineRelated, then disable the option
        const isRelated = isMedicineRelated?.some((medicine) => medicine.id === data.value)

        return (
            <div className="relative mt-1 rounded-md shadow-sm">
                <components.Option {...props} />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <button
                        type="button"
                        onClick={() => {
                            deleteMedicine({ id: data.value }, {
                                onSuccess: () => {
                                    utils.medicine.gets.invalidate()
                                }
                            })
                        }}
                        disabled={!isRelated}
                    >
                        {isRelated ? <XIcon className="w-5 h-5 text-gray-500" /> : null}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <>
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
                                            {errors.complaint && (
                                                <span className="text-red-500 text-xs">
                                                    * Keluhan pasien tidak boleh kosong
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-span-6 sm:col-span-3">
                                        <label
                                            htmlFor="drugs"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Terapi
                                        </label>
                                        <div className="mt-1">
                                            <Controller
                                                name='drugs'
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
                                                        components={{ Option }}
                                                        isClearable

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
                                                rules={{ required: false }}
                                            />
                                        </div>
                                        <Label className="text-gray-500 text-xs">
                                            * Jika obat tidak ada, silahkan tambahkan obat baru
                                        </Label>
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
                                                        name={field.name}
                                                        value={field.value as number}
                                                        onBlur={field.onBlur}
                                                        getInputRef={field.ref}
                                                        //if submit success, reset the value
                                                        onReset={() => field.onChange(0)}
                                                    />
                                                )}
                                                rules={
                                                    {
                                                        required: true,
                                                    }
                                                }
                                            />
                                            {errors.pay && (
                                                <span className="text-red-500 text-xs">
                                                    * Biaya tidak boleh kosong
                                                </span>
                                            )}
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
                                            {errors.checkup && (
                                                <span className="text-red-500 text-xs">
                                                    * Pemeriksaan pasien tidak boleh kosong
                                                </span>
                                            )}
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
                                            {errors.note && (
                                                <span className="text-red-500 text-xs">
                                                    * Catatan tidak boleh kosong
                                                </span>
                                            )}

                                        </div>
                                    </div>


                                    <div className="col-span-6 sm:col-span-3">
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
                                        {errors.diagnosis && (
                                            <span className="text-red-500 text-xs">
                                                * Diagnosis tidak boleh kosong
                                            </span>
                                        )}
                                    </div>
                                    <div className="col-span-6 sm:col-span-3">
                                        <label
                                            htmlFor="fee"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Tindakan {redAsterisk}
                                        </label>

                                        <Input
                                            type="text"
                                            id="diagnosis"
                                            {...register('treatment', {
                                                required: true,
                                            })}
                                            placeholder="Masukkan tindakan"
                                            className="mt-1"
                                        />
                                        {errors.treatment && (
                                            <span className="text-red-500 text-xs">
                                                * Tindakan tidak boleh kosong
                                            </span>
                                        )}

                                    </div>

                                    <div className="col-span-6">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Foto luka {" "}
                                        </label>

                                        <UploadDropzone previewAttachments={previewCheckUpAttachments} setPreviewAttachments={setPreviewCheckup} removeAttachment={removeAttachment} />

                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}