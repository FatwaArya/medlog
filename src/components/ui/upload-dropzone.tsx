import React, { createRef } from 'react';
import Dropzone from 'react-dropzone'
import Attachments, { AttachmentType } from '../checkup/Attachment'
import { useCheckUpAttachmentStore } from '@/store/previewAttachment';
import { FileAndAttachment, createAttachment } from '@/pages/dashboard/patients/checkup/new';
import { v4 as uuidv4 } from "uuid";
import { cn } from '@/utils/cn';

interface DropzoneRef {
    open: () => void;
}

const dropzoneRef = createRef<DropzoneRef>();
const openDialog = () => {
    // Note that the ref is set async,
    // so it might be null at some point 
    if (dropzoneRef.current) {
        dropzoneRef.current.open()
    }
};

interface UploadDropzoneProps {
    previewAttachments: FileAndAttachment[];
    removeAttachment: (attachment: AttachmentType) => void;
    setPreviewAttachments: (attachment: FileAndAttachment[]) => void;
}



const UploadDropzone = (props: UploadDropzoneProps) => {
    const { previewAttachments, removeAttachment, setPreviewAttachments } = props



    const onRemoveAttachment = (attachment: AttachmentType) => {
        removeAttachment(attachment);
    };

    console.log("shrek", previewAttachments)


    return <Dropzone
        multiple
        noClick
        noKeyboard
        ref={dropzoneRef}
        onDrop={(acceptedFiles) => {
            const newPreviewAttachments: FileAndAttachment[] = [];

            for (const file of acceptedFiles) {
                const attachment = createAttachment(file, uuidv4());

                newPreviewAttachments.push({
                    file,
                    attachment,
                });
            }

            setPreviewAttachments([
                ...newPreviewAttachments,
            ]);

        }}

    >
        {({ getRootProps, getInputProps, isDragActive }) => (
            <>
                <div className={cn("mt-1 flex justify-center rounded-md border-2 border-dashed px-6 pb-6 pt-5", isDragActive ? "border-blue-600" : "border-gray-300")} {...getRootProps()}>
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
                                    onClick={openDialog}
                                >
                                    <span>Upload a file</span>
                                    <input
                                        name="dropzone-file"
                                        type="file"
                                        className="sr-only"
                                        {...getInputProps()}
                                        accept="image/jpg, image/png"
                                        id="dropzone-file"
                                        multiple

                                    />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">
                                PNG, JPG up to 10MB
                            </p>
                        </div>
                    )}
                </div>
            </>
        )}

    </Dropzone>


}


export default UploadDropzone