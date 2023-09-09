import { create } from "zustand";

interface PaginationStore {
    meta:{
        totalPages: number;
        canNextPage: boolean;
        canPreviousPage: boolean;
    }
    setMeta: (meta: {
        totalPages: number;
        canNextPage: boolean;
        canPreviousPage: boolean;
    }) => void;
    clearMeta: () => void;
    
    page: number;
    setPage: (page: number) => void;
    clearPage: () => void;
    limit: number;
    setLimit: (limit: number) => void;
    clearLimit: () => void;
}

export const usePaginationStore = create<PaginationStore>((set) => ({
    meta:{
        totalPages: 0,
        canNextPage: false,
        canPreviousPage: false,
    },
    setMeta: (meta: {
        totalPages: number;
        canNextPage: boolean;
        canPreviousPage: boolean;
    }) => {
        set(() => ({
            meta,
        }));
    },
    clearMeta: () => {
        set(() => ({
            meta:{
                totalPages: 0,
                canNextPage: false,
                canPreviousPage: false,
            },
        }));
    },
    page: 1,
    setPage: (page: number) => {
        set(() => ({
            page,
        }));
    }
    ,
    clearPage: () => {
        set(() => ({
            page: 1,
        }));
    }
    ,
    limit: 10,
    setLimit: (limit: number) => {
        set(() => ({
            limit,
        }));
    }
    ,
    clearLimit: () => {
        set(() => ({
            limit: 10,
        }));
    }
    ,
}));
