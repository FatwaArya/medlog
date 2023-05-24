import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { api, type RouterOutputs } from "@/utils/api";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/id"; // ES 2015
import { createColumnHelper } from "@tanstack/react-table";
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
  const { data: patientData, isLoading } =
    api.patient.getNewestPatients.useQuery();
  // const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const patientColumns = [
    columnHelper.accessor("patient.id", {
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
    }),
    columnHelper.accessor("patient.name", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="nama pasien" />
      ),
      cell: (info) => <span>{info.getValue()}</span>,
      // filterFn: fuzzyFilter,
      // sortingFn: fuzzySort,
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
      // filterFn: fuzzyFilter,
      // sortingFn: fuzzySort,
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
      // filterFn: fuzzyFilter,
      // sortingFn: fuzzySort,
    }),
    columnHelper.accessor("patient.id", {
      header: "Aksi",
      cell: (info) => {
        console.log(info.getValue());
        return (
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
                  <MoreHorizontal className="mr-2 h-4 w-4" />
                  {isDetailed ? (
                    <Link
                      href={`/dashboard/patients/record/${info.getValue()}`}
                    >
                      Detail
                    </Link>
                  ) : (
                    <Link
                      href={`/dashboard/patients/checkup/${info.getValue()}/new`}
                    >
                      Periksa
                    </Link>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
    }),
  ];

  return (
    <div className="overflow-hidden bg-white shadow outline outline-1 outline-slate-200 sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="scroll-m-20  text-2xl font-semibold leading-6 tracking-tight text-[#3366FF]">
                Daftar Pasien
              </h1>
            </div>
            {/* <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none flex flex-row justify-center items-center gap-2">
                            <Button variant='outline' className="relative mt-1 rounded-md shadow-sm" href="/dashboard/patients/checkup/new">
                                <UserPlus className="h-5 w-5 text-gray-400" />
                            </Button>
                            <DebouncedInput
                                value={globalFilter ?? ""}
                                onChange={(value) => setGlobalFilter(String(value))}
                                className="font-lg border-block border p-2"
                                placeholder="Search"
                            />
                        </div> */}
          </div>
          <div className="mt-8 flex flex-col px-4 sm:px-6 lg:px-8">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full divide-gray-300 align-middle">
                {!isLoading && patientData ? (
                  <DataTable
                    columns={patientColumns}
                    data={patientData}
                    href="/dashboard/patients/checkup/new"
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
