import { Input } from "@/components/ui/input";
import type { ReactNode } from "react";
import { Activity, Search } from "lucide-react";
import { api, type RouterOutputs } from "@/utils/api";
import dayjs, { type Dayjs } from "dayjs";
import { Button } from "@/components/ui/button";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/id"; // ES 2015
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
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
  const { data: patientData, isLoading } = api.patient.getNewestPatients.useQuery({ isLastVisit: true });

  const patientColumn: ColumnDef<PatientColumn>[] = [
    {
      accessorKey: "patient.id",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "patient.name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="nama pasien" />
      ),
      cell: (info) => <span>{info.getValue() as ReactNode}</span>
    },
    {
      accessorKey: "patient.gender",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="jenis kelamin" />
      ),
      cell: (info) => <span className="capitalize">{info.getValue() as ReactNode}</span>
    },
    {
      accessorKey: "patient.birthDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="tanggal lahir" />
      ),
      cell: (info) => <span className="capitalize">{dayjs(info.getValue() as Dayjs).format("DD MMM YYYY")}</span>
    },
    {
      accessorKey: "patient.phone",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="no telepon" />
      ),
      cell: (info) => (
        <span className="capitalize">
          {!info.getValue() ? "tidak tersedia" : info.getValue() as ReactNode}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="kunjungan terakhir" />
      ),
      cell: (info) => <span>{dayjs(info.getValue() as Dayjs).fromNow()}</span>,
    },
    {
      accessorKey: "patient.id",
      header: "Aksi",
      cell: (info) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
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
      ),
    }
  ]

  return (
    <div className="py-10 sm:container md:mx-auto">
      <div className="flex flex-col gap-4 rounded-sm bg-white p-4 shadow outline outline-1 outline-slate-200">
        <div className="mb-4 w-full items-center justify-between md:flex">
          <div className="mb-3 flex flex-col gap-1 md:mb-0">
            <h2 className="text-xl font-semibold text-blue-500">
              Daftar Pasien
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              Menampilkan semua daftar pasien.
            </p>
          </div>
        </div>

        {!isLoading && patientData ? (
          <DataTable columns={patientColumn} data={patientData} />
        ) : (
          <div className="flex w-full flex-col gap-4">
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        )}
      </div>
    </div>
  );
}
