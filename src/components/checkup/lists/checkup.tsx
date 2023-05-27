import { api, type RouterOutputs } from "@/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/id"; // ES 2015
import {
    type ListProps,

} from "@/components/home/lists/patient";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { DataTable } from "@/components/ui/datatable/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTableColumnHeader } from "@/components/ui/datatable/data-table-column-header";
import { rupiah } from "@/utils/intlformat";
import { MoreHorizontal, User, } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

dayjs.extend(relativeTime);

const columnViews = [
    { title: "tanggal pemeriksaan" },
    { title: "diagnosis" },
    { title: "nama pasien" },
    { title: "jenis kelamin" },
    { title: "terapi" },
    { title: "biaya" },
  ]

export default function CheckupList({
    pageSize = 10,
    isPaginated = true,
    patientId,
}: ListProps) {
    const { data: CheckupData, isLoading } = api.record.getRecords.useQuery({ patientId: patientId as string });

    const checkupColumns = [
        {
            accessorKey: "createdAt",
            header: ({ column }: any) => (
                <DataTableColumnHeader column={column} title="tanggal pemeriksaan" />
              ),
            cell: (info: any) => dayjs(info.getValue()).format("DD MMMM YYYY"),
        },
        {
            accessorKey: "diagnosis",
            header: ({ column }: any) => (
                <DataTableColumnHeader column={column} title="diagnosis" />
              ),
            cell: (info: any) => <span>{info.getValue()}</span>,
        },
        {
            accessorKey: "patient.name",
            header: ({ column }: any) => (
                <DataTableColumnHeader column={column} title="nama pasien" />
              ),
            cell: (info: any) => <span>{info.getValue()}</span>,
        },
        {
            accessorKey: "patient.gender",
            header: ({ column }: any) => (
                <DataTableColumnHeader column={column} title="jenis kelamin" />
              ),
            cell: (info: any) => <span className="capitalize">{info.getValue()}</span>,
        },
        {
            accessorKey: "MedicineDetail",
            header: ({ column }: any) => (
                <DataTableColumnHeader column={column} title="terapi" />
              ),
            cell: (info: any) => {
    
                if (!info.getValue() || info.getValue().length === 0) {
                    return "Tidak ada terapi";
                } else {
                    return info.getValue().map((item: any, i: any) => (
                        <span key={i} className="capitalize">
                            {/* create delimiter */}
                            {i > 0 && ", "}
                            {item.medicine.name}
                        </span>
                    ));
                }
            },
        },
        {
            accessorKey: "pay",
            header: ({ column }: any) => (
                <DataTableColumnHeader column={column} title="biaya" />
              ),
            cell: (info: any) => {
                return (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        {rupiah.format(info.getValue())}
                    </span>
                );
            },
        },
        {
            accessorKey: "id",
            header: "Aksi",
            cell: (info: any) => {
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Buka menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <MoreHorizontal className="mr-2 h-4 w-4" />
                                <Link href={`/dashboard/patients/checkup/${info.getValue()}`}>
                                Detail
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ]

    return (
        <div className="overflow-hidden bg-white shadow outline outline-1 outline-slate-200 sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <div className="">
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto">
                            <h1 className="scroll-m-20  text-lg font-medium leading-6 tracking-tight text-[#3366FF]">
                                Riwayat Pemeriksaan
                            </h1>
                        </div>
                    </div>
                    <div className="mt-8 flex flex-col px-4 sm:px-6 lg:px-8">
                        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full divide-gray-300 align-middle">
                                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5">
                                    {
                                        !isLoading && CheckupData ? (
                                        <DataTable columns={checkupColumns} data={CheckupData} columnViews={columnViews} ></DataTable>
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
    );
}
