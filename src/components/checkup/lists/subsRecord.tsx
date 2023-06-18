import React from 'react'
import { type RouterOutputs, api } from '@/utils/api';
import { type ListProps } from '@/components/home/lists/admin';

import { DataTable } from '@/components/ui/datatable/data-table';
import { DataTableColumnHeader } from '@/components/ui/datatable/data-table-column-header';
import { createColumnHelper } from "@tanstack/react-table";
import dayjs from 'dayjs';
import { Skeleton } from '@/components/ui/skeleton';

import { statuses } from '@/components/accounts/data/data';
import { sub } from 'date-fns';

type SubsRecordColumn = RouterOutputs["admin"]["getSubsRecord"][number];

const columnHelper = createColumnHelper<SubsRecordColumn>();

const columnViews = [
  { title: "tanggal berlangganan" },
  { title: "status" },
  { title: "berlangganan hingga" },
]

export function SubsRecordList({ userId }: ListProps) {
  const { data: subsRecordData, isLoading } = api.admin.getSubsRecord.useQuery({ userId: userId as string });

  const subsRecordColumn = [
    columnHelper.accessor("createdAt", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='tanggal berlangganan' />
      ),
      cell: (info) => dayjs(info.getValue()).format("DD MMMM YYYY")
    }),
    columnHelper.accessor("status", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Status' />
      ),
      cell: ({ row }) => {
        const status = statuses.find(
          (status) => status.value === row.getValue("status")
        )

        if (!status) {
          return null
        }

        return (
          <div className="flex w-[100px] items-center">
            {status.icon && (
              <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
            )}
            <span>{status.label}</span>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    }),
    columnHelper.accessor("subscribedUntil", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='berlangganan hingga' />
      ),
      cell: (info) => info.getValue() === null ? <span>Belum berlangganan</span> : dayjs(info.getValue()).format("DD MMMM YYYY")
    }),
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
                    !isLoading && subsRecordData ? (
                      <DataTable columns={subsRecordColumn} data={subsRecordData} columnViews={columnViews} isFacetedFilter />
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
  )
}
