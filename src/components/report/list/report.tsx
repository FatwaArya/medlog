import { Download } from "lucide-react";
import { api, type RouterOutputs } from "@/utils/api";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import "dayjs/locale/id"; // ES 2015
import {
    createColumnHelper,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { addDays } from "date-fns";
import { type DateRange } from "react-day-picker";
import { rupiah } from "@/utils/intlformat";
import { CalendarDateRangePicker } from "@/components/ui/datepicker/calendarDateRangePicker";
import generatePDF from "@/service/reportGenerator";
import { Skeleton } from "@/components/ui/skeleton";

import { DataTable } from "@/components/ui/datatable/data-table";
import { DataTableColumnHeader } from "@/components/ui/datatable/data-table-column-header";

type ReportColumn = RouterOutputs['record']['getRecordReports'][number]

const columnHelper = createColumnHelper<ReportColumn>();

const columnViews = [
    { title: "tanggal pemeriksaan" },
    { title: "nama pasien" },
    { title: "alamat pasien" },
    { title: "no telepon" },
    { title: "nama perawat" },
    { title: "biaya" },
]

export default function ReportList() {
    // const { pageSize = 10, isPaginated = true } = props
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 20),
    })
    const { data, isLoading } = api.record.getRecordReports.useQuery({
        from: date?.from as Date,
        to: date?.to as Date,
    })

    const [reportsData, setReportsData] = useState<ReportColumn[]>(data || [])

    const reportColumns = [
        columnHelper.accessor("createdAt", {
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="tanggal pemeriksaan" />
            ),
            cell: (info) => {
                return <span className="capitalize">{dayjs(info.getValue()).format("DD MMMM YYYY")}</span>;
            },
        }),
        columnHelper.accessor("patient.name", {
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="nama pasien" />
            ),
            cell: (info) => {
                return <span>{info.getValue()}</span>;
            },
        }),
        columnHelper.accessor("patient.address", {
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="alamat pasien" />
            ),
            cell: (info) => {
                return <span className="capitalize">{info.getValue()}</span>;
            },
        }),
        columnHelper.accessor("patient.phone", {
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="no telepon" />
            ),
            cell: (info) => (
                <span className="capitalize">
                    {!info.getValue() ? "tidak tersedia" : info.getValue()}
                </span>
            ),
        }),
        columnHelper.accessor("patient.user.name", {
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="nama perawat" />
            ),
            cell: (info) => <span className="capitalize">{info.getValue()}</span>,
        }),
        columnHelper.accessor("pay", {
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="biaya" />
            ),
            cell: (info) => (
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    {rupiah.format(info.getValue())}
                </span>
            ),
        }),
    ]

    useEffect(() => {
        setReportsData(data || [])
    }, [data])
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
                                <Button onClick={() => generatePDF(reportsData)} disabled={reportsData?.length === 0} variant={"solidBlue"}>
                                    <Download className=" h-4 w-4" />
                                </Button>

                                <CalendarDateRangePicker setDate={setDate} date={date} />
                            </div>
                        </div>
                        <div className="mt-8 flex flex-col px-4 sm:px-6 lg:px-8">
                            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                <div className="inline-block min-w-full divide-gray-300 align-middle">
                                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5">
                                        {
                                            !isLoading && reportsData ? (
                                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                // @ts-ignore
                                                <DataTable columns={reportColumns} data={reportsData} columnViews={columnViews} />
                                            ) : (
                                                <Skeleton className="h-12 w-full whitespace-nowrap" />
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* PDF View */}

        </>
    );
}