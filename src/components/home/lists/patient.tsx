import { Input } from "@/components/ui/input";
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from "lucide-react";
import { api, type RouterOutputs } from "@/utils/api";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/id"; // ES 2015
import {
    useReactTable,
    type ColumnFiltersState,
    getCoreRowModel,
    getFilteredRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFacetedMinMaxValues,
    getPaginationRowModel,
    sortingFns,
    getSortedRowModel,
    type FilterFn,
    type SortingFn,
    flexRender,
    createColumnHelper,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";

dayjs.extend(relativeTime);
type PatientColumn = RouterOutputs["patient"]['getNewestPatients'][number];

import {
    type RankingInfo,
    rankItem,
    compareItems,
} from "@tanstack/match-sorter-utils";
import { Spinner } from "@/components/ui/loading-overlay";
import { UserPlus } from "lucide-react";

declare module "@tanstack/table-core" {
    interface FilterFns {
        fuzzy: FilterFn<unknown>;
    }
    interface FilterMeta {
        itemRank: RankingInfo;
    }
}

export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value);

    // Store the itemRank info
    addMeta({
        itemRank,
    });

    // Return if the item should be filtered in/out
    return itemRank.passed;
};

export const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
    let dir = 0;

    // Only sort by rank if the column has ranking information
    if (rowA.columnFiltersMeta[columnId]) {
        dir = compareItems(
            rowA.columnFiltersMeta[columnId]?.itemRank!,
            rowB.columnFiltersMeta[columnId]?.itemRank!
        );
    }

    // Provide an alphanumeric fallback for when the item ranks are equal
    return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};

const columnHelper = createColumnHelper<PatientColumn>();

export interface ListProps {
    patientId?: string;
    pageSize?: number;
    isPaginated?: boolean;
    isDetailed?: boolean;
}

export default function PatientList({ pageSize = 10, isPaginated = true, isDetailed = true }: ListProps) {
    const { data: patientData, isLoading } = api.patient.getNewestPatients.useQuery();
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState("");

    const patientColumns = [
        columnHelper.accessor("patient.name", {
            header: "Nama Pasien",
            cell: (info) => info.getValue(),
            filterFn: fuzzyFilter,
            sortingFn: fuzzySort,
        }),
        columnHelper.accessor("patient.gender", {
            header: "Jenis Kelamin",
            cell: (info) => <span className="capitalize">{info.getValue()}</span>,
        }),
        columnHelper.accessor('patient.birthDate', {
            header: "Tanggal Lahir",
            cell: (info) => dayjs(info.getValue()).format("DD MMM YYYY"),
            filterFn: fuzzyFilter,
            sortingFn: fuzzySort,
        }),
        columnHelper.accessor("createdAt", {
            header: "Kunjungan Terakhir",
            cell: (info) => {
                dayjs.locale("id")
                return dayjs(info.getValue()).fromNow();
            },
            filterFn: fuzzyFilter,
            sortingFn: fuzzySort,
        }),
        columnHelper.accessor('patient.id', {
            header: "Aksi",
            cell: (info) => (
                <>
                    <div className="flex gap-2 flex-col sm:flex-row">
                        {isDetailed ? (
                            <Button
                                variant="solidBlue"
                                className=" px-6 text-sm font-normal"
                                size="sm"
                                href={`/dashboard/patients/record/${info.getValue()}`}
                            >
                                Detail
                            </Button>
                        ) : (
                            <Button
                                variant="solidBlue"
                                className=" px-6 text-sm font-normal"
                                size="sm"
                                href={`/dashboard/patients/checkup/${info.getValue()}/new`}
                            >
                                Periksa
                            </Button>
                        )}



                    </div>
                </>


            ),
        }),
    ];


    const table = useReactTable({
        data: patientData || [],
        columns: patientColumns,
        initialState: {
            pagination: {
                pageSize,
            }
        },
        filterFns: {
            fuzzy: fuzzyFilter,
        },
        state: {
            columnFilters,
            globalFilter,
        },
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: fuzzyFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
    });

    return (
        <div className="overflow-hidden bg-white shadow sm:rounded-lg outline outline-1 outline-slate-200">
            <div className="px-4 py-5 sm:p-6">
                <div className="">
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto">
                            <h1 className="leading-6  scroll-m-20 text-2xl font-semibold tracking-tight text-[#3366FF]">
                                Daftar Pasien
                            </h1>
                        </div>
                        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none flex flex-row justify-center items-center gap-2">
                            <Button variant='outline' className="relative mt-1 rounded-md shadow-sm" href="/dashboard/patients/checkup/new">
                                <UserPlus className="h-5 w-5 text-gray-400" />
                            </Button>
                            <DebouncedInput
                                value={globalFilter ?? ""}
                                onChange={(value) => setGlobalFilter(String(value))}
                                className="font-lg border-block border p-2"
                                placeholder="Search"
                            />
                        </div>
                    </div>
                    <div className="mt-8 flex flex-col px-4 sm:px-6 lg:px-8">
                        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full divide-gray-300 align-middle">
                                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5">
                                    <table className="min-w-full divide-y divide-gray-300 ">
                                        <thead className="bg-white">
                                            {table.getHeaderGroups().map((headerGroup) => (
                                                <tr key={headerGroup.id}>
                                                    {headerGroup.headers.map((header) => {
                                                        return (
                                                            <th
                                                                key={header.id}
                                                                scope="col"
                                                                className={
                                                                    "px-3 py-3.5 text-left text-sm  font-normal"
                                                                }
                                                            >
                                                                {header.isPlaceholder ? null : (
                                                                    <>
                                                                        {flexRender(
                                                                            header.column.columnDef.header,
                                                                            header.getContext()
                                                                        )}
                                                                    </>
                                                                )}
                                                            </th>
                                                        );
                                                    })}
                                                </tr>
                                            ))}
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {isLoading && (
                                                <tr>
                                                    <td colSpan={6}>
                                                        <div className="flex items-center justify-center py-8">
                                                            <Spinner />
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}

                                            {!isLoading && table.getRowModel().rows.length === 0 && (
                                                <tr>
                                                    <td colSpan={6}>
                                                        <div className="flex items-center justify-center py-8">
                                                            <Button
                                                                variant="solidBlue"
                                                                className=" px-6 text-sm font-normal"
                                                                href="/dashboard/patients/checkup/new"
                                                            >
                                                                Daftar Pasien
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}

                                            {table.getRowModel().rows.map((row) => {
                                                return (
                                                    <tr key={row.id} className="hover:bg-slate-700/10 cursor-pointer">
                                                        {row.getVisibleCells().map((cell) => {
                                                            return (
                                                                <td
                                                                    key={cell.id}
                                                                    className={
                                                                        cell.column.columnDef.header === "Patient"
                                                                            ? "whitespace-nowrap py-4 pl-8 pr-3 text-sm font-medium text-gray-900"
                                                                            : "whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                                                                    }
                                                                >
                                                                    {flexRender(
                                                                        cell.column.columnDef.cell,
                                                                        cell.getContext()
                                                                    )}
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                {isPaginated && (
                                    <div className="flex items-center gap-2 justify-center mt-4 flex-row">
                                        <span className="flex items-center gap-1">
                                            {table.getState().pagination.pageIndex + 1} dari{' '}
                                            {table.getPageCount()}
                                        </span>
                                        <div className="flex gap-4">
                                            <button
                                                className={`border rounded p-1 ${!table.getCanPreviousPage() ? 'bg-gray-200' : ''
                                                    }`}
                                                onClick={() => table.previousPage()}
                                                disabled={!table.getCanPreviousPage()}
                                            >
                                                <ChevronLeftIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                className={`border rounded p-1 ${!table.getCanNextPage() ? 'bg-gray-200' : ''
                                                    }`}
                                                onClick={() => table.nextPage()}
                                                disabled={!table.getCanNextPage()}
                                            >
                                                <ChevronRightIcon className="w-4 h-4" />
                                            </button>
                                        </div>

                                    </div>)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// A debounced input react component
export function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
}: {
    value: string | number;
    onChange: (value: string | number) => void;
    debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value);
        }, debounce);

        return () => clearTimeout(timeout);
    }, [value]);

    return (
        <>
            <div className="relative mt-1 rounded-md shadow-sm">
                <Input
                    {...props}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
            </div>
        </>
    );
}
