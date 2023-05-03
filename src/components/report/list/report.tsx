import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon, DownloadIcon } from "lucide-react";
import { api, type RouterOutputs } from "@/utils/api";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import "dayjs/locale/id"; // ES 2015
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFacetedMinMaxValues,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
    createColumnHelper,
} from "@tanstack/react-table";
import { useEffect, useRef, useState } from "react";
import { type ListProps, fuzzyFilter, fuzzySort } from "@/components/home/lists/patient";
import { addDays } from "date-fns";
import { type DateRange } from "react-day-picker";
import { rupiah } from "@/utils/intlformat";
import { Spinner } from "@/components/ui/loading-overlay";
import { CalendarDateRangePicker } from "@/components/ui/datepicker/calendarDateRangePicker";
import generatePDF from "@/service/reportGenerator";

type ReportColumn = RouterOutputs['record']['getRecordReports'][number]

const columnHelper = createColumnHelper<ReportColumn>();
const ReportColumns = [
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
    columnHelper.accessor('patient.address', {
        header: "Alamat Pasien",
        cell: (info) => {
            return <span className="capitalize">{info.getValue()}</span>;
        },
        filterFn: fuzzyFilter,
        sortingFn: fuzzySort,
    }),
    columnHelper.accessor('patient.phone', {
        header: "Nomor Telepon",
        cell: (info) => {
            return <span className="capitalize">{info.getValue()}</span>;
        },
        filterFn: fuzzyFilter,
        sortingFn: fuzzySort,
    }),
    columnHelper.accessor('patient.user.name', {
        header: "Nama Perawat",
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
]


export default function ReportList(props: ListProps) {
    const { pageSize = 10, isPaginated = true } = props
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 20),
    })
    const { data, isLoading } = api.record.getRecordReports.useQuery({
        from: date?.from as Date,
        to: date?.to as Date,
    })

    const [reportsData, setReportsData] = useState<ReportColumn[]>(data || [])

    useEffect(() => {
        setReportsData(data || [])
    }, [data])
    const componentRef = useRef(null);


    const table = useReactTable({
        data: reportsData || [],
        columns: ReportColumns,
        initialState: {
            pagination: {
                pageSize,
            },
        },
        filterFns: {
            fuzzy: fuzzyFilter,
        },
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
    });
    //https://www.npmjs.com/package/react-to-print
    return (
        <>
            <div className="overflow-hidden bg-white shadow outline outline-1 outline-slate-200 sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <div className="">
                        <div className="sm:flex sm:items-center">
                            <div className="sm:flex-auto">
                                <h1 className="scroll-m-20  text-2xl font-semibold leading-6 tracking-tight text-[#3366FF]">
                                    Laporan Pasien
                                </h1>
                            </div>
                            <div className="noScreen mt-4 sm:ml-16 sm:mt-0 sm:flex-none flex flex-row justify-center gap-2">
                                {/* <ReactToPrint
                                    trigger={() => {
                                        return <Button disabled={reportsData?.length === 0} variant={"solidBlue"}>
                                            <DownloadIcon className=" h-4 w-4" />
                                        </Button>
                                    }}
                                    content={() => componentRef.current}
                                /> */}
                                <Button onClick={() => generatePDF(reportsData)} disabled={reportsData?.length === 0} variant={"solidBlue"}>
                                    <DownloadIcon className=" h-4 w-4" />
                                </Button>

                                <CalendarDateRangePicker setDate={setDate} date={date} />
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
                                                                {/* <Button
                                                                    variant="solidBlue"
                                                                    className=" px-6 text-sm font-normal"
                                                                    href="/dashboard/checkup/new"
                                                                >
                                                                    Daftar Pasien
                                                                </Button> */}
                                                                {/*  */}
                                                                Pasien tidak ditemukan atau coba ganti tanggal
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
                                                    className={`rounded border p-1 ${!table.getCanPreviousPage() ? "bg-gray-200" : ""}`}
                                                    onClick={() => table.previousPage()}
                                                    disabled={!table.getCanPreviousPage()}
                                                >
                                                    <ChevronLeftIcon className="h-4 w-4" />
                                                </button>
                                                <button
                                                    className={`rounded border p-1 ${!table.getCanNextPage() ? "bg-gray-200" : ""}`}
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

            {/* PDF View */}
            <div className="overflow-hidden bg-white shadow outline outline-1 outline-slate-200 sm:rounded-lg -z-50 relative" ref={componentRef}>
                <div className="px-4 py-5 sm:p-6">
                    <div className="">
                        <div className="sm:flex sm:items-center">
                            <div className="sm:flex-auto">
                                <h1 className="scroll-m-20  text-2xl font-semibold leading-6 tracking-tight text-[#3366FF]">
                                    Laporan Pasien
                                </h1>
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
                                                                {/* <Button
                                                                    variant="solidBlue"
                                                                    className=" px-6 text-sm font-normal"
                                                                    href="/dashboard/checkup/new"
                                                                >
                                                                    Daftar Pasien
                                                                </Button> */}
                                                                {/*  */}
                                                                Pasien tidak ditemukan atau coba ganti tanggal
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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}