import { Activity } from "lucide-react";
import { api, type RouterOutputs } from "@/utils/api";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/id"; // ES 2015
import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

import { DataTable } from "@/components/ui/datatable/data-table";
import { DataTableColumnHeader } from "@/components/ui/datatable/data-table-column-header";

dayjs.extend(relativeTime);
type PatientColumn = RouterOutputs["patient"]["getNewestPatients"][number];

import { MoreHorizontal } from "lucide-react";

const columnHelper = createColumnHelper<PatientColumn>();

export interface ListProps {
  patientId?: string;
  pageSize?: number;
  isPaginated?: boolean;
  isDetailed?: boolean;
}

export default function PatientList() {
  const { data: patientData, isLoading } = api.patient.getNewestPatients.useQuery();

  const patientColumns = [
    columnHelper.accessor("patient.name", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="nama pasien" />
      ),
      cell: (info) => <span>{info.getValue()}</span>,
    }),
    columnHelper.accessor("patient.gender", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="jenis kelamin" />
      ),
      cell: (info) => <span className="capitalize">{info.getValue()}</span>,
    }),
    columnHelper.accessor("patient.birthDate", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="tanggal lahir" />
      ),
      cell: (info) => (
        <span className="capitalize">
          {dayjs(info.getValue()).format("DD MMM YYYY")}
        </span>
      ),
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
    columnHelper.accessor("createdAt", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="kunjungan terakhir" />
      ),
      cell: (info) => <span>{dayjs(info.getValue()).fromNow()}</span>,
    }),
    columnHelper.accessor("patient.id", {
      header: "Aksi",
      cell: (info) => (
        <>
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
                <Activity className="mr-2 h-4 w-4" />
                <Link
                  href={`/dashboard/patients/checkup/${info.getValue()}/new`}
                >
                  Periksa
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MoreHorizontal className="mr-2 h-4 w-4" />
                <Link href={`/dashboard/patients/record/${info.getValue()}`}>
                  Detail
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ),
    }),
  ];

  const columnViews = [
    { title: "nama pasien" },
    { title: "jenis kelamin" },
    { title: "tanggal lahir" },
    { title: "no telepon" },
    { title: "kunjungan terakhir" },
  ];

  return (
    <div className="overflow-hidden bg-white shadow outline outline-1 outline-slate-200 sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div>
          <div className="sm:flex sm:items-center ">
            <div className="sm:flex-auto">
              <h1 className="scroll-m-20  text-2xl font-semibold leading-6 tracking-tight text-[#3366FF]">
                Daftar Pasien
              </h1>
            </div>
          </div>
          <div className="mt-6 flex flex-col px-4 sm:px-6 lg:px-8">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full divide-gray-300 align-middle">
                {!isLoading && patientData ? (
                  <DataTable
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    columns={patientColumns}
                    href="/dashboard/patients/checkup/new"
                    data={patientData}
                    columnViews={columnViews}
                    filter="patient_name"
                    filterTitle="nama"
                  // isPaginated={false}
                  />
                ) : (
                  <Skeleton className="h-12 w-full whitespace-nowrap" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
