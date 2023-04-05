import { Input } from "@/components/ui/input"
import { Loader2, SearchIcon } from "lucide-react"
import { api, RouterOutputs } from "@/utils/api";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import relativeTime from "dayjs/plugin/relativeTime";
import 'dayjs/locale/id' // ES 2015 
import {
    Column,
    Table,
    useReactTable,
    ColumnFiltersState,
    getCoreRowModel,
    getFilteredRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFacetedMinMaxValues,
    getPaginationRowModel,
    sortingFns,
    getSortedRowModel,
    FilterFn,
    SortingFn,
    ColumnDef,
    flexRender,
    FilterFns,
    createColumnHelper,
} from '@tanstack/react-table'
import { useEffect, useMemo, useState } from "react";

dayjs.extend(relativeTime)
type PatientColumn = RouterOutputs["patient"]["getNewestPatients"][number]

import {
    RankingInfo,
    rankItem,
    compareItems,
} from '@tanstack/match-sorter-utils'

declare module '@tanstack/table-core' {
    interface FilterFns {
        fuzzy: FilterFn<unknown>
    }
    interface FilterMeta {
        itemRank: RankingInfo
    }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value)

    // Store the itemRank info
    addMeta({
        itemRank,
    })

    // Return if the item should be filtered in/out
    return itemRank.passed
}

const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
    let dir = 0

    // Only sort by rank if the column has ranking information
    if (rowA.columnFiltersMeta[columnId]) {
        dir = compareItems(
            rowA.columnFiltersMeta[columnId]?.itemRank!,
            rowB.columnFiltersMeta[columnId]?.itemRank!
        )
    }

    // Provide an alphanumeric fallback for when the item ranks are equal
    return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}

const columnHelper = createColumnHelper<PatientColumn>()

const patientColumns = [
    columnHelper.accessor('patient.name', {
        header: 'Patient',
        cell: info => info.getValue(),
        filterFn: fuzzyFilter,
        sortingFn: fuzzySort,
    }),
    columnHelper.accessor('patient.gender', {
        header: 'Sex',
        cell: info => <span className="capitalize">{info.getValue()}</span>,
    }),
    columnHelper.accessor('patient.birthDate', {
        header: 'Date of Birth',
        cell: info => dayjs(info.getValue()).format('DD MMM YYYY'),
        filterFn: fuzzyFilter,
        sortingFn: fuzzySort,
    }),
    columnHelper.accessor('patient.NIK', {
        header: 'NIK',
        cell: info => info.getValue(),
        filterFn: fuzzyFilter,
        sortingFn: fuzzySort,
    }),
    columnHelper.accessor('createdAt', {
        header: 'Visit',
        cell: info => dayjs(info.getValue()).fromNow(),
        filterFn: fuzzyFilter,
        sortingFn: fuzzySort,
    }),
    columnHelper.accessor('patient.id', {
        header: 'Action',
        cell: info => <Button variant="solidBlue" className=" text-sm font-normal px-6">Create Order</Button>,
        filterFn: fuzzyFilter,
        sortingFn: fuzzySort,
    })
]




export default function PatientList() {
    const { data: patientData, isLoading } = api.patient.getNewestPatients.useQuery()
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const [globalFilter, setGlobalFilter] = useState('')


    const table = useReactTable({
        data: patientData || [],
        columns: patientColumns,
        filterFns: {
            fuzzy: fuzzyFilter,
        },
        state: {
            columnFilters,
            globalFilter,
        },
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: fuzzyFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
        debugRows: true,
    })

    return (
        <div className="bg-white overflow-hidden shadow sm:rounded-lg" >
            <div className="px-4 py-5 sm:p-6">  <div className="px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-xl text-[#3366FF] font-semibold">Create Order</h1>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                        <DebouncedInput
                            value={globalFilter ?? ''}
                            onChange={value => setGlobalFilter(String(value))}
                            className="p-2 font-lg border border-block"
                            placeholder="Search"
                        />

                    </div>
                </div>
                <div className="mt-8 flex flex-col">
                    <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle divide-gray-300">
                            <div className="overflow-hidden shadow-sm ring-black ring-opacity-5 ring-1">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-white">
                                        {table.getHeaderGroups().map(headerGroup => (
                                            <tr key={headerGroup.id}>
                                                {headerGroup.headers.map(header => {
                                                    return (
                                                        <th key={header.id} scope="col"
                                                            className={header.column.columnDef.header === 'Patient' ? "py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8" : "px-3 py-3.5 text-left text-sm font-semibold text-gray-900"}
                                                        >
                                                            {header.isPlaceholder ? null : (
                                                                <>
                                                                    {flexRender(
                                                                        header.column.columnDef.header,
                                                                        header.getContext()
                                                                    )}
                                                                </>
                                                            )}
                                                        </th>
                                                    )
                                                })}
                                            </tr>
                                        ))}
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {table.getRowModel().rows.length === 0 && (
                                            <tr>
                                                <td colSpan={6}>
                                                    <div className="flex justify-center items-center py-8">
                                                        <Button variant="solidBlue" className=" text-sm font-normal px-6">Daftar Pasien</Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                        {table.getRowModel().rows.map(row => {
                                            return (
                                                <tr key={row.id} className="">
                                                    {row.getVisibleCells().map(cell => {
                                                        return (
                                                            <td key={cell.id}
                                                                className={cell.column.columnDef.header === 'Patient' ? "py-4 pl-8 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap" : "whitespace-nowrap px-3 py-4 text-sm text-gray-500"}
                                                            >
                                                                {flexRender(
                                                                    cell.column.columnDef.cell,
                                                                    cell.getContext()
                                                                )}
                                                            </td>
                                                        )
                                                    })}
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div >
    )
}

// A debounced input react component
function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
}: {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value)
        }, debounce)

        return () => clearTimeout(timeout)
    }, [value])

    return (
        <>
            <div className="mt-1 relative rounded-md shadow-sm">
                <Input {...props} value={value} onChange={e => setValue(e.target.value)} />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
            </div>
        </>)
}
