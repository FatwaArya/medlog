"use client"

import {
    type ColumnDef,
    type ColumnFiltersState,
    type FilterFn,
    flexRender,
    getCoreRowModel,
    type VisibilityState,
    getPaginationRowModel,
    getFilteredRowModel,
    type SortingState,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { type RankingInfo, rankItem } from "@tanstack/match-sorter-utils"
import { SearchIcon, UserPlus } from "lucide-react"
import { useState, useEffect } from "react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { DataTablePagination } from "@/components/ui/datatable/data-table-pagination"
import { DataTableViewOptions } from "@/components/ui/datatable/data-table-viewOptions"
import { DataTableToolbar } from "@/components/ui/datatable/data-table-toolbar"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    columnViews?: { title: string }[]
    data: TData[]
    href?: string
    filter?: string
    filterTitle?: string
    isFacetedFilter?: boolean
}

declare module "@tanstack/table-core" {
    interface FilterFns {
        fuzzy: FilterFn<unknown>;
    }
    interface FilterMeta {
        itemRank: RankingInfo;
    }
}

export const fuzzyFilter: FilterFn<unknown> = (row, columnId, value, addMeta) => {
    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value);

    // Store the itemRank info
    addMeta({
        itemRank,
    });

    // Return if the item should be filtered in/out
    return itemRank.passed;
};

export function DataTable<TData, TValue>(
    { columns, data, columnViews, filter, filterTitle, isFacetedFilter }: DataTableProps<TData, TValue>
) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [globalFilter, setGlobalFilter] = useState("");

    const table = useReactTable({
        data: data || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        filterFns: {
            fuzzy: fuzzyFilter,
        },
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter,
        }
    });

    return (
        <div className="space-y-4">
      <DataTableToolbar table={table} isFacetedFilter={isFacetedFilter} columnViews={columnViews} filter={filter} filterTitle={filterTitle} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                return (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  )
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
    )
}

// A debounced input react component
export function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 200,
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
            <div className="relative rounded-md shadow-sm">
                <Input
                    {...props}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
            </div>
        </>
    );
}