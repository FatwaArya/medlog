import React from "react";
import { api, type RouterOutputs } from "@/utils/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  User,
  UserX,
  CircleSlashed,
} from "lucide-react";
import Link from "next/link";

import { DataTable } from "@/components/ui/datatable/data-table";
import { DataTableColumnHeader } from "@/components/ui/datatable/data-table-column-header";

import { createColumnHelper } from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuSubTrigger,
  DropdownMenuSub,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";

type AdminColumn = RouterOutputs["admin"]["getUserByRole"][number];

const columnHelper = createColumnHelper<AdminColumn>();

const columnViews = [
  { title: "nama" },
  { title: "email" },
  { title: "no telepon" },
  { title: "status" },
  { title: "subscribed until" },
]

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

  const adminColumns = [
    columnHelper.accessor("image", {
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
    }),
    columnHelper.accessor("name", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="nama" />
      ),
      cell: (info) => <span className="capitalize">{info.getValue()}</span>,
    }),
    columnHelper.accessor("email", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="email" />
      ),
      cell: (info) => <span className="capitalize">{info.getValue()}</span>,
    }),
    columnHelper.accessor("phone", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="no telepon" />
      ),
      cell: (info) => (
        <span className="capitalize">
          {!info.getValue() ? "tidak tersedia" : info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("isSubscribed", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="langganan" />
      ),
      cell: (info) => (
        <span className="capitalize">
          {info.getValue() ? "Langganan" : "Tidak Langganan"}
        </span>
      ),
    }),
    columnHelper.accessor("subscribedToAdmin", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="langganan hingga" />
      ),
      cell: (info) => (
        <span className="capitalize">
          {!info.getValue()[0]?.subscribedUntil
            ? "Belum berlangganan"
            : dayjs(info.getValue()[0]?.subscribedUntil).format("DD MMMM YYYY")}
        </span>
      ),
    }),
    columnHelper.accessor("id", {
      header: "Aksi",
      cell: (info) => {
        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isSubscribed(info.getValue()) ? (
                  <DropdownMenuItem
                    onClick={() => {
                      void deactivateUser.mutate({ id: info.getValue() });
                    }}
                  >
                    <UserX className="mr-2 h-4 w-4" />
                    <span>Deactive</span>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <User className="mr-2 h-4 w-4" />
                      <span>Activate</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        {/* header */}
                        <DropdownMenuLabel>Plans</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            void activateUser.mutate({
                              id: info.getValue(),
                              plan: "1m",
                            });
                          }}
                        >
                          1 Month
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            void activateUser.mutate({
                              id: info.getValue(),
                              plan: "3m",
                            });
                          }}
                        >
                          3 Month
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            void activateUser.mutate({
                              id: info.getValue(),
                              plan: "6m",
                            });
                          }}
                        >
                          6 Month
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                )}
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
          </>
        );
      },
    }),
  ]

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
                      <DataTable columns={adminColumns} data={adminData} columnViews={columnViews} />
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
