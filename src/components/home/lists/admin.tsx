import React, {type ReactNode} from "react";
import { api, type RouterOutputs } from "@/utils/api";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import {
  MoreHorizontal,
  ArrowUpDown,
  User,
  UserX,
  CircleSlashed,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

import { DataTable } from "@/components/ui/datatable/data-table";
import { DataTableColumnHeader } from "@/components/ui/datatable/data-table-column-header";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "react-hot-toast";

type AdminColumn = RouterOutputs["admin"]["getUserByRole"][number];

const columnHelper = createColumnHelper<AdminColumn>();

export default function AdminList() {
  const utils = api.useContext();
  const { data: adminData, isLoading } = api.admin.getUserByRole.useQuery();
  const activateUser = api.admin.activateUser.useMutation({
    onSuccess: () => {
      utils.admin.getUserByRole.invalidate();
      toast.success("Berhasil mengaktifkan akun");
    },
  });
  const deactivateUser = api.admin.deactivateUser.useMutation({
    onSuccess: () => {
      utils.admin.getUserByRole.invalidate();
      toast.success("Berhasil menonaktifkan akun");
    },
  });

  const isSubscribed = (id: string) => {
    const admin = adminData?.find((admin) => admin.id === id);
    return admin?.isSubscribed;
  };

  const adminColumn:ColumnDef<AdminColumn>[] = [
    {
      accessorKey: "id",
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
      accessorKey: "image",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Profil" />
      ),
      cell: (info) => (
        <Avatar>
          <AvatarImage src={info.getValue() as string} />
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="nama" />
      ),
      cell: (info) => <span className="capitalize">{info.getValue() as ReactNode}</span>,
    },
    {
      accessorKey: "phone",
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
      accessorKey: "isSubscribed",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="status" />
      ),
      cell: (info) => (
        <span className="capitalize">
          {info.getValue() ? "Langganan" : "Tidak Langganan" as ReactNode}
        </span>
      ),
    },
    {
      accessorKey: "id",
      header: "Aksi",
      cell: (info) => (
        <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={
                    isSubscribed(info.getValue() as string)
                      ? () => deactivateUser.mutate({ id: info.getValue() as string })
                      : () => activateUser.mutate({ id: info.getValue() as string })
                  }
                >
                  {isSubscribed(info.getValue() as string) ? (
                    <button className="flex">
                      <UserX className="mr-2 h-4 w-4" />
                      <span>Deactive</span>
                    </button>
                  ) : (
                    <button className="flex">
                      <User className="mr-2 h-4 w-4" />
                      <span>Activate</span>
                    </button>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MoreHorizontal className="mr-2 h-4 w-4" />
                  <Link
                    href={`/dashboard/accounts-management/${info.getValue()}`}
                  >
                    Details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <CircleSlashed className="mr-2 h-4 w-4" />
                  Ban User
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
      ),
    }
  ];

  return (
    <>
      <div className="overflow-hidden bg-white shadow outline outline-1 outline-slate-200 sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div>
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h1 className="scroll-m-20  text-2xl font-semibold leading-6 tracking-tight text-[#3366FF]">
                  Daftar Admin
                </h1>
              </div>
            </div>
            <div className="mt-8 flex flex-col px-4 sm:px-6 lg:px-8">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full divide-gray-300 align-middle">
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5">
                    {!isLoading && adminData ? (
                      <DataTable columns={adminColumn} data={adminData} />
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
    </>
  );
}
