import { type AttachmentType } from "@/components/checkup/Attachment";
import { type FileAndAttachment } from "@/pages/dashboard/checkup/new";
import { create } from "zustand";

interface AttachmentStore {
  fileAndAttachment: FileAndAttachment[];
  setFileAndAttachment: (fileAndAttachment: FileAndAttachment[]) => void;
  removeFileAndAttachment: (fileAndAttachment: AttachmentType) => void;
  clearFileAndAttachment: () => void;
}

export const useCheckUpAttachmentStore = create<AttachmentStore>((set) => ({
  fileAndAttachment: [],
  setFileAndAttachment: (fileAndAttachment: FileAndAttachment[]) => {
    set((state) => ({
      fileAndAttachment: [...state.fileAndAttachment, ...fileAndAttachment],
    }));
  },
  removeFileAndAttachment: (attachment: AttachmentType) => {
    set((state) => ({
      fileAndAttachment: state.fileAndAttachment.filter(
        (p) => p.attachment !== attachment
      ),
    }));
  },
  clearFileAndAttachment: () => {
    set(() => ({
      fileAndAttachment: [],
    }));
  },
}));

export const useLabsAttachmentStore = create<AttachmentStore>((set) => ({
  fileAndAttachment: [],
  setFileAndAttachment: (fileAndAttachment: FileAndAttachment[]) => {
    set((state) => ({
      fileAndAttachment: [...state.fileAndAttachment, ...fileAndAttachment],
    }));
  },
  removeFileAndAttachment: (attachment: AttachmentType) => {
    set((state) => ({
      fileAndAttachment: state.fileAndAttachment.filter(
        (p) => p.attachment !== attachment
      ),
    }));
  },
  clearFileAndAttachment: () => {
    set(() => ({
      fileAndAttachment: [],
    }));
  },
}));
