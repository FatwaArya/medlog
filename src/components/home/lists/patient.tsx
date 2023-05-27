import { Input } from "@/components/ui/input";
import { Activity, Search } from "lucide-react";
import { api, type RouterOutputs } from "@/utils/api";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/id"; // ES 2015
import { createColumnHelper } from "@tanstack/react-table";
import { useEffect, useState } from "react";
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

export default function PatientList({ isDetailed = true }: ListProps) {
  const { data: patientData, isLoading } =
    api.patient.getNewestPatients.useQuery();
  // const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const patientColumns = [
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
      accessorKey: "patient.birthDate",
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="tanggal lahir" />
      ),
      cell: (info: any) => (
        <span className="capitalize">
          {dayjs(info.getValue()).format("DD MMM YYYY")}
        </span>
      ),
    },
    {
      accessorKey: "patient.phone",
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="no telepon" />
      ),
      cell: (info: any) => (
        <span className="capitalize">
          {!info.getValue() ? "tidak tersedia" : info.getValue()}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="kunjungan terakhir" />
      ),
      cell: (info: any) => <span>{dayjs(info.getValue()).fromNow()}</span>,
    },
    {
      accessorKey: "id",
      header: "Aksi",
      cell: (info: any) => (
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
    },
  ]


  // const table = useReactTable({
  //     data: patientData || [],
  //     columns: patientColumns,
  //     initialState: {
  //         pagination: {
  //             pageSize,
  //         }
  //     },
  //     filterFns: {
  //         fuzzy: fuzzyFilter,
  //     },
  //     state: {
  //         columnFilters,
  //         globalFilter,
  //     },
  //     onColumnFiltersChange: setColumnFilters,
  //     onGlobalFilterChange: setGlobalFilter,
  //     globalFilterFn: fuzzyFilter,
  //     getCoreRowModel: getCoreRowModel(),
  //     getFilteredRowModel: getFilteredRowModel(),
  //     getSortedRowModel: getSortedRowModel(),
  //     getPaginationRowModel: getPaginationRowModel(),
  //     getFacetedRowModel: getFacetedRowModel(),
  //     getFacetedUniqueValues: getFacetedUniqueValues(),
  //     getFacetedMinMaxValues: getFacetedMinMaxValues(),
  // });

  const columnViews = [
    { title: "nama pasien" },
    { title: "jenis kelamin" },
    { title: "tanggal lahir" },
    { title: "no telepon" },
    { title: "kunjungan terakhir" },
  ]

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
                    href="/dashboard/patients/checkup/new"
                    data={patientData}
                    columnViews={columnViews}
                  />
                ) : (
                  <Skeleton className="w-full whitespace-nowrap h-12" />
                )}
                {/* <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5">
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
                                                Array(3).fill(0).map((_, i) => (
                                                    <tr key={i}>
                                                        <td colSpan={6}>
                                                            <div className="flex items-center max-w-full justify-center py-2">
                                                                <Skeleton className="w-full whitespace-nowrap h-12" />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
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
                                </div> */}
                {/* {isPaginated && (
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

                                    </div>)} */}
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
