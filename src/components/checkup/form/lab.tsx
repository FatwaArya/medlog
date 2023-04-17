
import { createAttachment } from "@/pages/dashboard/checkup/new";
import { useFormContext } from "react-hook-form";
import Attachments, { type AttachmentType } from "@/components/checkup/Attachment";
import { v4 as uuidv4 } from "uuid";
import { useLabsAttachmentStore } from "@/store/previewAttachment";



export function LabForm() {
    const { register } = useFormContext()
    const previewLabAttachments = useLabsAttachmentStore((state) => state.fileAndAttachment);
    const setPreviewLab = useLabsAttachmentStore((state) => state.setFileAndAttachment);
    const removeAttachment = useLabsAttachmentStore((state) => state.removeFileAndAttachment);

    const onRemoveAttachment = (attachment: AttachmentType) => {
        removeAttachment(attachment);
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

            setPreviewLab([
                ...previewLabAttachments,
                ...newPreviewLabAttachments,
            ]);
        }
    };

    return (<div>
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
                            Foto hasil lab dan ronsen
                        </label>
                        <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pb-6 pt-5">
                            {previewLabAttachments.length > 0 ? (
                                <div className="mt-3.5 grid gap-2">
                                    <Attachments
                                        attachments={previewLabAttachments.map(
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
                                                accept="image/*"
                                                onChange={onLabFilesChange}
                                            />
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
    </div>)
}