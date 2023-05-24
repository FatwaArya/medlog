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
import { useState } from "react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { DataTablePagination } from "@/components/ui/datatable/data-table-pagination"
import { DataTableViewOptions } from "@/components/ui/datatable/data-table-viewOptions"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    href?: string
}

declare module "@tanstack/table-core" {
    interface FilterFns {
        fuzzy: FilterFn<unknown>;
    }
    interface FilterMeta {
        itemRank: RankingInfo;
    }
}

export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
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
    { columns, data, href }: DataTableProps<TData, TValue>
) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});

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
            rowSelection
        }
    });

    return (
        <>
            <div className="flex items-center py-4 justify-between">
                <div className="flex items-center gap-4">
                    <div className="relative mt-1 rounded-md shadow-sm">
                        <Input
                            placeholder="Search..."
                            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
                            onChange={(event) => table.getColumn("email")?.setFilterValue(event.target.value)}
                            className="w-full sm:w-64"
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                    </div>
                    <Button variant='outline' className="relative mt-1 rounded-md shadow-sm" href={href ?? "#"}>
                        <UserPlus className="h-5 w-5 text-gray-400" />
                    </Button>
                </div>
                <DataTableViewOptions table={table} />
            </div>
            <div className="rounded-md border bg-white overflow-x-auto">
                <Table className="w-full">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header, index) => (
                                    <TableHead key={index} className="py-2 sm:py-4">
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row, rowIndex) => (
                                <TableRow key={rowIndex} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell, cellIndex) => (
                                        <TableCell key={cellIndex} className="whitespace-nowrap px-3 py-4">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results to display.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="pt-4 pb-2">
                <DataTablePagination table={table} />
            </div>
        </>
    )
}