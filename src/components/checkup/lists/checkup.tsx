import { api, type RouterOutputs } from "@/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/id"; // ES 2015
import { type ListProps } from "@/components/home/lists/patient";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { DataTable } from "@/components/ui/datatable/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTableColumnHeader } from "@/components/ui/datatable/data-table-column-header";
import { rupiah } from "@/utils/intlformat";
import { MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { createColumnHelper, PaginationState } from "@tanstack/react-table";
import { use, useEffect, useState } from "react";

dayjs.extend(relativeTime);

type CheckupColumn = RouterOutputs["record"]["getRecords"]['data'][number];

const columnHelper = createColumnHelper<CheckupColumn>();

const columnViews = [
  { title: "tanggal pemeriksaan" },
  { title: "diagnosis" },
  { title: "nama pasien" },
  { title: "jenis kelamin" },
  { title: "terapi" },
  { title: "biaya" },
];

export default function CheckupList({ patientId }: ListProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 1,
    pageSize: 10,
  })
  const [sort, setSort] = useState({
    field: "createdAt",
    direction: "desc",
  })
  const utils = api.useContext()


  const { data: CheckupData, isLoading,  isPreviousData,  } = api.record.getRecords.useQuery({
    patientId: patientId as string,
  }, {
    queryKey: ['record.getRecords', {
      patientId: patientId as string,
      page: pagination.pageIndex,
      limit: pagination.pageSize,
      sortBy: sort.field,
      sortDirection: sort.direction as 'asc' | 'desc',
    }]
  });
  
  //prefetch
  useEffect(() => {
    if (!isPreviousData && CheckupData?.meta.hasMore) {
      utils.record.getRecords.prefetch({
        patientId: patientId as string,
        page: pagination.pageIndex,
        limit: pagination.pageSize,
        sortBy: sort.field,
        sortDirection: sort.direction as 'asc' | 'desc',
      })
    }

  }, [pagination, sort, isPreviousData, CheckupData, utils.record.getRecords])



  const checkupColumns = [
    columnHelper.accessor("createdAt", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="tanggal pemeriksaan" />
      ),
      cell: (info) => dayjs(info.getValue()).format("DD MMMM YYYY"),
    }),
    columnHelper.accessor("diagnosis", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="diagnosis" />
      ),
      cell: (info) => <span>{info.getValue()}</span>,
    }),
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
    columnHelper.accessor("MedicineDetail", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="terapi" />
      ),
      cell: (info) => {
        if (!info.getValue() || info.getValue().length === 0) {
          return "Tidak ada terapi";
        } else {
          return info.getValue().map((item, i) => (
            <span key={i} className="capitalize">
              {/* create delimiter */}
              {i > 0 && ", "}
              {item.medicine.name}
            </span>
          ));
        }
      },
    }),
    columnHelper.accessor("pay", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Biaya" />
      ),
      cell: (info) => {
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            {rupiah.format(info.getValue())}
          </span>
        );
      },
    }),
    columnHelper.accessor("id", {
      header: "Aksi",
      cell: (info) => {
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
    }),
  ];

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
                  {!isLoading && CheckupData ? (
                    <DataTable
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      columns={checkupColumns}
                      data={CheckupData.data}
                      pagination={pagination}
                      setPagination={setPagination}
                      meta={CheckupData.meta}
                      columnViews={columnViews}
                      href={`/dashboard/patients/checkup/${patientId}/new`}
                      isPaginated={true}
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
    </div>
  );
}
