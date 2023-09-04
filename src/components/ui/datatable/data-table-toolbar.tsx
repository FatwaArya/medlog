"use client"

import { Table } from "@tanstack/table-core";
import { SearchIcon, X, UserPlus, Scroll } from "lucide-react";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "@/components/ui/datatable/data-table-viewOptions";
import { DataTableFacetedFilter } from "@/components/ui/datatable/data-table-faceted-filter";

import { useEffect, useState } from "react";


interface DataTableToolbarProps<TData> {
    table: Table<TData>
    filter?: string
    filterTitle?: string
    isFacetedFilter?: boolean
    columnViews?: { title: string }[]
    href?: string
    isAddable?: boolean
}

export function DataTableToolbar<TData>({
    table, filter, isFacetedFilter, columnViews, href, filterTitle, isAddable
}: DataTableToolbarProps<TData>) {
    const isFiltered =
        table.getPreFilteredRowModel().rows.length >
        table.getFilteredRowModel().rows.length;

    return (
        <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
                <div className="flex flex-1 items-center space-x-2 mt-1 ml-1">
                    {
                        filter && (
                            <Input
                                placeholder={`Filter ${filterTitle}...`}
                                value={(table.getColumn(filter)?.getFilterValue() as string) ?? ""}
                                onChange={(e) =>
                                    table.getColumn(filter)?.setFilterValue(e.target.value)
                                }
                                className="h-8 w-[150px] lg:w-[250px]"
                            />
                        )
                    }
                    {
                        href && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="ml-auto h-8 lg:flex mt-1 mr-1"
                                href={href ?? "#"}
                            >
                                <Scroll className="mr-2 h-4 w-4" />
                                Checkup
                            </Button>
                        )
                    }

                    {isFiltered && (
                        <Button
                            variant="ghost"
                            onClick={() => table.resetColumnFilters()}
                            className="h-8 px-2 lg:px-3"
                        >
                            Reset
                            <X className="ml-2 h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
            <div className="flex">
                <DataTableViewOptions columnViews={columnViews} table={table} />

            </div>

        </div>
    )
}