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
    getSortedRowModel,
    flexRender,
    createColumnHelper,
    Column,
    Table,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import {
    DebouncedInput,
    type ListProps,
    fuzzyFilter,
    fuzzySort,
} from "@/components/home/lists/patient";
import { Spinner } from "@/components/ui/loading-overlay";
import { rupiah } from "@/utils/intlformat";
import {
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronUpIcon,
} from "lucide-react";

dayjs.extend(relativeTime);

type CheckupColumn = RouterOutputs["record"]["getRecords"][number];

const columnHelper = createColumnHelper<CheckupColumn>();

export default function CheckupList({
    pageSize = 10,
    isPaginated = true,
}: ListProps) {
    const { data: CheckupData, isLoading } = api.record.getRecords.useQuery();
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState("");

    const CheckupColumns = [
        columnHelper.accessor("createdAt", {
            header: "Tanggal Pemeriksaan",
            cell: (info) => {
                return dayjs(info.getValue()).format("DD MMMM YYYY");
            },

        }),
        columnHelper.accessor("patient.name", {
            header: "Nama Pasien",
            cell: (info) => {
                return info.getValue();
            },
            filterFn: fuzzyFilter,
            sortingFn: fuzzySort,
        }),
        columnHelper.accessor("patient.gender", {
            header: "Jenis Kelamin",
            cell: (info) => {
                return <span className="capitalize">{info.getValue()}</span>;
            },
            filterFn: fuzzyFilter,
            sortingFn: fuzzySort,
        }),
        columnHelper.accessor("pay", {
            header: "Biaya",
            cell: (info) => {
                return (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        {rupiah.format(info.getValue())}
                    </span>
                );
            },
            filterFn: fuzzyFilter,
            sortingFn: fuzzySort,
        }),
        columnHelper.accessor("id", {
            header: "Aksi",
            cell: (info) => {
                return (
                    <Button
                        href={`/dashboard/checkup/${info.getValue()}`}
                        variant="solidBlue"
                        size="sm"
                        className=" px-6 text-sm font-normal"
                    >
                        Lihat
                    </Button>
                );
            },
        }),
    ];
    const table = useReactTable({
        data: CheckupData || [],
        columns: CheckupColumns,
        initialState: {
            pagination: {
                pageSize,
            },
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
        <div className="overflow-hidden bg-white shadow outline outline-1 outline-slate-200 sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <div className="">
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto">
                            <h1 className="scroll-m-20  text-2xl font-semibold leading-6 tracking-tight text-[#3366FF]">
                                Pemeriksaan Pasien
                            </h1>
                        </div>
                        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
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
                                                                colSpan={header.colSpan}
                                                                className="px-3 py-3.5 text-left text-sm  font-normal"
                                                            >
                                                                {header.isPlaceholder ? null : (
                                                                    <>
                                                                        <div
                                                                            {...{
                                                                                className: header.column.getCanSort()
                                                                                    ? "cursor-pointer select-none"
                                                                                    : "",
                                                                                onClick:
                                                                                    header.column.getToggleSortingHandler(),
                                                                            }}
                                                                            className="flex items-center gap-1"
                                                                        >
                                                                            {flexRender(
                                                                                header.column.columnDef.header,
                                                                                header.getContext()
                                                                            )}
                                                                            {{
                                                                                asc: <ChevronUpIcon />,
                                                                                desc: <ChevronDownIcon />,
                                                                            }[
                                                                                header.column.getIsSorted() as string
                                                                            ] ?? null}
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </th>
                                                            // <th
                                                            //     key={header.id}
                                                            //     scope="col"
                                                            //     className={
                                                            //         "px-3 py-3.5 text-left text-sm  font-normal"
                                                            //     }
                                                            // >
                                                            //     {header.isPlaceholder ? null : (
                                                            //         <div
                                                            //             {...{
                                                            //                 className: header.column.getCanSort()
                                                            //                     ? 'cursor-pointer select-none'
                                                            //                     : '',
                                                            //                 onClick: header.column.getToggleSortingHandler(),
                                                            //             }}

                                                            //         >
                                                            //             <>
                                                            //                 {flexRender(
                                                            //                     header.column.columnDef.header,
                                                            //                     header.getContext()
                                                            //                 )}
                                                            //                 {{
                                                            //                     asc: ChevronUpIcon,
                                                            //                     desc: ChevronDownIcon,
                                                            //                 }[header.column.getIsSorted() as string] ?? null}

                                                            //             </>
                                                            //         </div>
                                                            //     )}
                                                            // </th>
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
                                                                href="/dashboard/checkup/new"
                                                            >
                                                                Daftar Pasien
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}

                                            {table.getRowModel().rows.map((row) => {
                                                return (
                                                    <tr
                                                        key={row.id}
                                                        className="cursor-pointer hover:bg-slate-700/10"
                                                    >
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
                                    <div className="mt-4 flex flex-row items-center justify-center gap-2">
                                        <span className="flex items-center gap-1">
                                            {table.getState().pagination.pageIndex + 1} dari{" "}
                                            {table.getPageCount()}
                                        </span>
                                        <div className="flex gap-4">
                                            <button
                                                className={`rounded border p-1 ${!table.getCanPreviousPage() ? "bg-gray-200" : ""
                                                    }`}
                                                onClick={() => table.previousPage()}
                                                disabled={!table.getCanPreviousPage()}
                                            >
                                                <ChevronLeftIcon className="h-4 w-4" />
                                            </button>
                                            <button
                                                className={`rounded border p-1 ${!table.getCanNextPage() ? "bg-gray-200" : ""
                                                    }`}
                                                onClick={() => table.nextPage()}
                                                disabled={!table.getCanNextPage()}
                                            >
                                                <ChevronRightIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// function Filter({
//     column,
//     table,
// }: {
//     column: Column<CheckupColumn, unknown>
//     table: Table<CheckupColumn>
// }) {
//     const firstValue = table
//         .getPreFilteredRowModel()
//         .flatRows[0]?.getValue(column.id)

//     const columnFilterValue = column.getFilterValue()

//     const sortedUniqueValues = useMemo(
//         () =>
//             typeof firstValue === 'number'
//                 ? []
//                 : Array.from(column.getFacetedUniqueValues().keys()).sort(),
//         [column.getFacetedUniqueValues()]
//     )

//     return typeof firstValue === 'number' ? (
//         <div>
//             <div className="flex space-x-2">
//                 <DebouncedInput
//                     type="number"
//                     min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
//                     max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
//                     value={(columnFilterValue as [number, number])?.[0] ?? ''}
//                     onChange={value =>
//                         column.setFilterValue((old: [number, number]) => [value, old?.[1]])
//                     }
//                     placeholder={`Min ${column.getFacetedMinMaxValues()?.[0]
//                         ? `(${column.getFacetedMinMaxValues()?.[0]})`
//                         : ''
//                         }`}
//                     className="w-24 border shadow rounded"
//                 />
//                 <DebouncedInput
//                     type="number"
//                     min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
//                     max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
//                     value={(columnFilterValue as [number, number])?.[1] ?? ''}
//                     onChange={value =>
//                         column.setFilterValue((old: [number, number]) => [old?.[0], value])
//                     }
//                     placeholder={`Max ${column.getFacetedMinMaxValues()?.[1]
//                         ? `(${column.getFacetedMinMaxValues()?.[1]})`
//                         : ''
//                         }`}
//                     className="w-24 border shadow rounded"
//                 />
//             </div>
//             <div className="h-1" />
//         </div>
//     ) : (
//         <>
//             <datalist id={column.id + 'list'}>
//                 {sortedUniqueValues.slice(0, 5000).map((value: any) => (
//                     <option value={value} key={value} />
//                 ))}
//             </datalist>
//             <DebouncedInput
//                 type="text"
//                 value={(columnFilterValue ?? '') as string}
//                 onChange={value => column.setFilterValue(value)}
//                 placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
//                 className="w-36 border shadow rounded"
//                 list={column.id + 'list'}
//             />
//             <div className="h-1" />
//         </>
//     )
// }
