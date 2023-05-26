import React from 'react'
import { api, type RouterOutputs } from "@/utils/api";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ArrowUpDown, UserCheck, UserX, Trash2 } from "lucide-react";
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';

import { DataTable } from '@/components/ui/datatable/data-table';
import { DataTableColumnHeader } from '@/components/ui/datatable/data-table-column-header';

import {
  createColumnHelper
} from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu"

type AdminColumn = RouterOutputs["admin"]["getUserByRole"][number];

const columnHelper = createColumnHelper<AdminColumn>();

export interface ListProps {
  pageSize?: number,
  isPaginated?: boolean
}

export default function AdminList ({ pageSize = 10, isPaginated = true }: ListProps){

    const { data: adminData, isLoading } = api.admin.getUserByRole.useQuery();
    const [isSubscribe, setIsSubscribe] = useState<boolean>(true);

    const onSubs = (id: string) => {
      const admin = adminData?.filter((data) => {
         return data.id === id;
      })
    }

    const adminColumns = [
      columnHelper.accessor("name", {
        header: ({column}) => (
          <DataTableColumnHeader column={column} title='nama' />
        ),
        cell: (info) => <span className='capitalize'>{info.getValue()}</span>
      }),
      columnHelper.accessor("email", {
        header: ({column}) => (
          <DataTableColumnHeader column={column} title='email' />
        ),
        cell: (info) => <span>{info.getValue()}</span>
      }),
      columnHelper.accessor("phone", {
        header: ({column}) => (
          <DataTableColumnHeader column={column} title='no telepon' />
        ),
        cell: (info) => <span className='capitalize'>{!info.getValue() ? 'tidak tersedia' : info.getValue()}</span>
      }),
      columnHelper.accessor("id", {
        header: "Aksi",
        cell: (info) => {
          console.log(info.getValue());
          return (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onSubs(info.getValue())}
                  >
                    {isSubscribe ? (
                      <>
                        <UserX className='h-4 w-4 mr-2' />
                        <span>Unactivate</span>
                      </>
                    ) : (
                      <>
                        <UserCheck className='h-4 w-4 mr-2' />
                        <span>Activate</span>
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <MoreHorizontal className='h-4 w-4 mr-2' />
                    <Link href={`/dashboard/admins/${info.getValue()}`}>Details</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Trash2 className='h-4 w-4 mr-2' />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )
        }
      }),
    ]

    const columnViews = [
      {title : "nama" },
      {title : "email" },
      {title : "no telepon" },
  ]

  return (
    <>
    <div className='overflow-hidden bg-white shadow sm:rounded-lg outline-1 outline-slate-200'>
      <div className='px-4 py-5 sm:p-6'>
        <div>
          <div className='sm:flex sm:items-center'>
            <div className='sm:flex-auto'>
              <h1 className="leading-6  scroll-m-20 text-2xl font-semibold tracking-tight text-[#3366FF]">
                Daftar Admin
              </h1>
            </div>
          </div>
          <div className='mt-8 flex flex-col px-4 sm:px-6 lg:px-8'>
            <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
              <div className='inline-block min-w-full divide-gray-300 align-middle'>
                <div className='overflow-hidden shadow ring-1 ring-black ring-opacity-5'>
                  {!isLoading && adminData ? (
                    <DataTable columns={adminColumns} data={adminData} columnViews={columnViews} />
                    ) : (
                    <Skeleton className="w-full whitespace-nowrap h-12" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
