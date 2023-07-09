"use client"

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { type Table } from "@tanstack/react-table"
import { SlidersHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

interface DataTableViewOptionsProps<TData> {
    table: Table<TData>
    columnViews?: { title: string }[]
}

export function DataTableViewOptions<TData>({
    table, columnViews
}: DataTableViewOptionsProps<TData>) {
    const columnShow = () => {
        const getAllColumns = table.getAllColumns().filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide() && !column.id.includes("id")).map((column) => column)

        const mappedArray = getAllColumns.map((element, index) => {
            const correspondingElement = columnViews && columnViews[index];
            return {
                columnData: element,
                title: correspondingElement
            };
        });

        return {
            mappedArray,
            getAllColumns
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto hidden h-8 lg:flex mt-1 mr-1"
                >
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    View
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[150px]">
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {
                    columnViews ? columnShow().mappedArray.map((column, columnIdx) => {
                        return (
                            <DropdownMenuCheckboxItem
                                key={columnIdx}
                                className="capitalize"
                                checked={column.columnData.getIsVisible()}
                                onCheckedChange={(value) => column.columnData.toggleVisibility(!!value)}
                            >
                                {column.title?.title}
                            </DropdownMenuCheckboxItem>
                        )
                    }) : (
                        columnShow().getAllColumns.map((column, columnIdx) => {
                            return (
                                <DropdownMenuCheckboxItem
                                    key={columnIdx}
                                    className="capitalize"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                >
                                    {column.id}
                                </DropdownMenuCheckboxItem>
                            )
                        })
                    )
                }
            </DropdownMenuContent>
        </DropdownMenu>
    )
}