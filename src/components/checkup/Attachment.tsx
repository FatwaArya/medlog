import type { Prisma } from "@prisma/client";
import { cn } from "@/utils/cn";
import { Button } from "../ui/button";
import { XIcon } from "lucide-react";


export type AttachmentType = Prisma.AttachmentGetPayload<{
    include: {
        File: true
    }
}>;

export type RemoveAttachmentType = (attachment: AttachmentType) => void;

const Attachments: React.FC<{
    attachments: AttachmentType[];
    onRemoveAttachment?: RemoveAttachmentType;
}> = ({ attachments, onRemoveAttachment }) => {
    const className = cn("grid gap-2 h-full w-full", {
        "grid-rows-1": attachments.length <= 2,
        "grid-rows-2": attachments.length > 2,
        "grid-cols-1": attachments.length === 1,
        "grid-cols-2": attachments.length > 1,
    });

    return (
        <div className={className}>
            {attachments.map((attachment, i) => (
                <Attachment
                    attachment={attachment}
                    fill={attachments.length === 3 && i === 0}
                    onRemoveAttachment={onRemoveAttachment}
                    key={attachment.id}
                />
            ))}
        </div>
    );
};

export const Attachment: React.FC<{
    attachment: AttachmentType;
    fill: boolean;
    onRemoveAttachment?: RemoveAttachmentType;
}> = ({ attachment, fill, onRemoveAttachment }) => {
    const className = cn("overflow-hidden rounded-lg relative shadow", {
        "row-span-2": fill,
    });
    return (
        <div className={className}>
            {onRemoveAttachment && (
                <div className="absolute right-1 top-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveAttachment(attachment)}
                    >
                        <XIcon className="h-4 w-4" />

                    </Button>
                </div>
            )}
            {/* if file ext is pdf use react -f */}
            {attachment.File?.extension === "pdf" ? (
                <embed src={attachment.File?.url} type="application/pdf" width="100%" height="100%" />

            ) : (
                <img
                    className="h-full w-full object-cover"
                    alt="Attachment"
                    src={attachment.File?.url}
                />
            )}
        </div>
    );
};

export default Attachments;
