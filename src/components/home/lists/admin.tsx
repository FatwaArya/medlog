import React from 'react'
import { api, type RouterOutputs } from "@/utils/api";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { DataTable } from '@/components/ui/data-table';

import {
  useReactTable,
  type ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  sortingFns,
  getSortedRowModel,
  type FilterFn,
  type SortingFn,
  flexRender,
  createColumnHelper
} from "@tanstack/react-table";

type AdminColumn = RouterOutputs["admin"]["getUserByRole"][number];

const columnHelper = createColumnHelper<AdminColumn>();

export interface ListProps {
  pageSize?: number,
  isPaginated?: boolean
}

export default function AdminList ({ pageSize = 10, isPaginated = true }: ListProps){

    const { data: adminData, isLoading } = api.admin.getUserByRole.useQuery();

    console.log(adminData);

  return (
    <div>admin</div>
  )
}
