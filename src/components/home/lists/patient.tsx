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
import { Skeleton } from "@/components/ui/skeleton";

dayjs.extend(relativeTime);
type PatientColumn = RouterOutputs["patient"]["getNewestPatients"][number];

import {
  type RankingInfo,
  rankItem,
  compareItems,
} from "@tanstack/match-sorter-utils";
import { Spinner } from "@/components/ui/loading-overlay";
import { UserPlus, MoreHorizontal } from "lucide-react";

// declare module "@tanstack/table-core" {
//     interface FilterFns {
//         fuzzy: FilterFn<unknown>;
//     }
//     interface FilterMeta {
//         itemRank: RankingInfo;
//     }
// }

// export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
//     // Rank the item
//     const itemRank = rankItem(row.getValue(columnId), value);

//     // Store the itemRank info
//     addMeta({
//         itemRank,
//     });

//     // Return if the item should be filtered in/out
//     return itemRank.passed;
// };

// export const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
//     let dir = 0;

//     // Only sort by rank if the column has ranking information
//     if (rowA.columnFiltersMeta[columnId]) {
//         dir = compareItems(
//             rowA.columnFiltersMeta[columnId]?.itemRank!,
//             rowB.columnFiltersMeta[columnId]?.itemRank!
//         );
//     }

//     // Provide an alphanumeric fallback for when the item ranks are equal
//     return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
// };

const columnHelper = createColumnHelper<PatientColumn>();

export interface ListProps {
  patientId?: string;
  pageSize?: number;
  isPaginated?: boolean;
  isDetailed?: boolean;
}

export default function PatientList({ isDetailed = true }: ListProps) {
  const { data: patientData, isLoading } = api.patient.getNewestPatients.useQuery({ isLastVisit: true })
  // const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

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
              <Link
                href={`/dashboard/patients/checkup/${info.getValue()}/new`}
                className="flex items-center"
              >
                <Activity className="mr-2 h-4 w-4" />

                Periksa
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`/dashboard/patients/record/${info.getValue()}`} className="flex items-center">
                <MoreHorizontal className="mr-2 h-4 w-4" />
                Detail
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    }
  ]

  return (
    <div className="flex flex-col gap-4 rounded-sm bg-white p-4 shadow outline outline-1 outline-slate-200">
      <div className="px-2 py-5 sm:p-6">
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
          <DataTable columns={patientColumn} data={patientData} href="/dashboard/patients/checkup/new"
            filter="patient_name"
            filterTitle="nama"
            isPaginated={true}

          />
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
          <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
      </div>
    </>
  );
}
