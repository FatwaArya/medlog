
import { createAttachment } from "@/pages/dashboard/patients/checkup/new";
import { useFormContext } from "react-hook-form";
import Attachments, { type AttachmentType } from "@/components/checkup/Attachment";
import { v4 as uuidv4 } from "uuid";
import { useLabsAttachmentStore } from "@/store/previewAttachment";
import UploadDropzone from "@/components/ui/upload-dropzone";



export function LabForm() {
    const { register } = useFormContext()
    const previewLabAttachments = useLabsAttachmentStore((state) => state.fileAndAttachment);
    const setPreviewLab = useLabsAttachmentStore((state) => state.setFileAndAttachment);
    const removeAttachment = useLabsAttachmentStore((state) => state.removeFileAndAttachment);


    return (<div>
        <div className="bg-white overflow-hidden sm:rounded-lg outline outline-1 outline-slate-200 mb-4 rounded-sm">
            <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-blue-600">Data Lab</h3>
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
                                            placeholder="Masukkan Catatan lab"
                                            defaultValue={""}
                                            {...register("labNote")}
                                        />
                                    </div>
                                </div>

                                <div className="col-span-6">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Foto hasil lab dan ronsen
                                    </label>
                                    <UploadDropzone previewAttachments={previewLabAttachments} setPreviewAttachments={setPreviewLab} removeAttachment={removeAttachment} />
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