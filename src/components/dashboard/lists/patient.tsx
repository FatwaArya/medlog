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

// const columnHelper = createColumnHelper<PatientColumn>()

// const patientColumns = [
//     columnHelper.accessor('patient.name', {
//         header: 'Patient',
//         cell: info => info.getValue(),

//         sortingFn: fuzzySort,
//     }),
//     columnHelper.accessor('patient.gender', {
//         header: 'Sex',
//         cell: info => info.getValue()
//     }),
//     columnHelper.accessor('patient.birthDate', {
//         header: 'Age',
//         cell: info => dayjs(info.getValue()).format('DD MMM YYYY')
//     }),
//     columnHelper.accessor('patient.NIK', {
//         header: 'NIK',
//         cell: info => info.getValue()
//     }),
//     columnHelper.accessor('createdAt', {
//         header: 'Visit'
//     }),
//     columnHelper.accessor('patient.id', {
//         header: 'Action',
//         cell: info => <Button variant="solidBlue" className=" text-sm font-normal px-6">Create Order</Button>

//     })
// ]




export default function PatientList() {
    const { data: patientData, isLoading } = api.patient.getNewestPatients.useQuery()
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const [globalFilter, setGlobalFilter] = useState('')

    const columns = useMemo<ColumnDef<PatientColumn>[]>(() => [
        {
            header: 'Patient',
            accessorKey: 'patient.name',
            cell: info => info.getValue(),
            filterFns: {
                fuzzy: fuzzyFilter,
            },
            sortingFn: fuzzySort,
        },
        {
            header: 'Sex',
            accessorKey: 'patient.gender',
            cell: info => info.getValue(),

        }
        ,
        // {
        //     header: 'Date of Birth',
        //     accessorKey: 'patient.birthDate',
        //     cell: info => info.getValue(),
        //     filterFns: {
        //         fuzzy: fuzzyFilter,
        //     },
        //     sortingFn: fuzzySort,
        // },
        {
            header: 'NIK',
            accessorKey: 'patient.NIK',
            cell: info => info.getValue(),
            filterFns: {
                fuzzy: fuzzyFilter,
            },
            sortingFn: fuzzySort,
        },
        // {
        //     header: 'Visit',
        //     accessorKey: 'createdAt',
        //     cell: info => info.getValue(),
        //     filterFns: {
        //         fuzzy: fuzzyFilter,
        //     },
        //     sortingFn: fuzzySort,
        // },
        {
            header: 'Action',
            accessorKey: 'patient.id',
            cell: info => <Button variant="solidBlue" className=" text-sm font-normal px-6">Create Order</Button>
        }
    ], [])

    const table = useReactTable({
        data: patientData || [],
        columns,
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
        debugTable: true,
        debugHeaders: true,
        debugColumns: false,
    })


    return (
        // <div className="bg-white overflow-hidden shadow sm:rounded-lg" >
        //     <div className="px-4 py-5 sm:p-6">  <div className="px-4 sm:px-6 lg:px-8">
        //         <div className="sm:flex sm:items-center">
        //             <div className="sm:flex-auto">
        //                 <h1 className="text-xl text-[#3366FF] font-semibold">Create Order</h1>
        //             </div>
        //             <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        //                 <div className="mt-1 relative rounded-md shadow-sm">
        //                     <Input placeholder="Search" />
        //                     <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        //                         <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        //                     </div>
        //                 </div>

        //             </div>
        //         </div>
        //         <div className="mt-8 flex flex-col">
        //             <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        //                 <div className="inline-block min-w-full py-2 align-middle">
        //                     <div className="overflow-hidden ring-1 ring-black ring-opacity-5">
        //                         <table className="min-w-full divide-y bg-white">
        //                             <thead className="bg-white">
        //                                 <tr>
        //                                     <th
        //                                         scope="col"
        //                                         className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8"
        //                                     >
        //                                         Patients
        //                                     </th>
        //                                     <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
        //                                         Sex
        //                                     </th>
        //                                     <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
        //                                         Date of Birth
        //                                     </th>
        //                                     <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
        //                                         NIK
        //                                     </th>
        //                                     <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
        //                                         EMR
        //                                     </th>
        //                                     <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
        //                                         Last Visit
        //                                     </th>
        //                                     <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
        //                                         Action
        //                                     </th>
        //                                 </tr>
        //                             </thead>
        //                             <tbody className="divide-y divide-gray-200 bg-white">
        //                                 {isLoading ? (
        //                                     <tr>
        //                                         <div className="flex items-center justify-center">
        //                                             <Loader2 className="animate-spin h-8 w-8" />
        //                                         </div>
        //                                     </tr>
        //                                 ) :
        //                                     (patientData?.map((person) => (
        //                                         <tr key={person.patient?.id}>
        //                                             <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
        //                                                 {person.patient?.name}
        //                                             </td>
        //                                             <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 capitalize">{person.patient?.gender}</td>
        //                                             <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{dayjs(person.patient?.birthDate).format('DD MMM YYYY')}</td>
        //                                             <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.patient?.NIK}</td>
        //                                             <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.patient?.NIK}</td>
        //                                             <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{dayjs(person.createdAt).fromNow()}</td>

        //                                             <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 items-center flex">
        //                                                 <Button variant="solidBlue" className=" text-sm font-normal px-6">Create Order</Button>
        //                                             </td>
        //                                         </tr>
        //                                     )))}
        //                             </tbody>
        //                         </table>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     </div></div>
        // </div >
        <div className="p-2">
            <div>
                <DebouncedInput
                    value={globalFilter ?? ''}
                    onChange={value => setGlobalFilter(String(value))}
                    className="p-2 font-lg shadow border border-block"
                    placeholder="Search all columns..."
                />
            </div>
            <div className="h-2" />
            <table>
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => {
                                return (
                                    <th key={header.id} colSpan={header.colSpan}>
                                        {header.isPlaceholder ? null : (
                                            <>
                                                <div
                                                    {...{
                                                        className: header.column.getCanSort()
                                                            ? 'cursor-pointer select-none'
                                                            : '',
                                                        onClick: header.column.getToggleSortingHandler(),
                                                    }}
                                                >
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                    {{
                                                        asc: ' 🔼',
                                                        desc: ' 🔽',
                                                    }[header.column.getIsSorted() as string] ?? null}
                                                </div>
                                                {header.column.getCanFilter() ? (
                                                    <div>
                                                        <Filter column={header.column} table={table} />
                                                    </div>
                                                ) : null}
                                            </>
                                        )}
                                    </th>
                                )
                            })}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => {
                        return (
                            <tr key={row.id}>
                                {row.getVisibleCells().map(cell => {
                                    return (
                                        <td key={cell.id}>
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
            <div className="h-2" />
            <div className="flex items-center gap-2">
                <button
                    className="border rounded p-1"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                >
                    {'<<'}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    {'<'}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    {'>'}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                >
                    {'>>'}
                </button>
                <span className="flex items-center gap-1">
                    <div>Page</div>
                    <strong>
                        {table.getState().pagination.pageIndex + 1} of{' '}
                        {table.getPageCount()}
                    </strong>
                </span>
                <span className="flex items-center gap-1">
                    | Go to page:
                    <input
                        type="number"
                        defaultValue={table.getState().pagination.pageIndex + 1}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                            table.setPageIndex(page)
                        }}
                        className="border p-1 rounded w-16"
                    />
                </span>
                <select
                    value={table.getState().pagination.pageSize}
                    onChange={e => {
                        table.setPageSize(Number(e.target.value))
                    }}
                >
                    {[10, 20, 30, 40, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
            <div>{table.getPrePaginationRowModel().rows.length} Rows</div>

            <pre>{JSON.stringify(table.getState(), null, 2)}</pre>
        </div>
    )
}

function Filter({
    column,
    table,
}: {
    column: Column<any, unknown>
    table: Table<any>
}) {
    const firstValue = table
        .getPreFilteredRowModel()
        .flatRows[0]?.getValue(column.id)

    const columnFilterValue = column.getFilterValue()

    const sortedUniqueValues = useMemo(
        () =>
            typeof firstValue === 'number'
                ? []
                : Array.from(column.getFacetedUniqueValues().keys()).sort(),
        [column.getFacetedUniqueValues()]
    )

    return typeof firstValue === 'number' ? (
        <div>
            <div className="flex space-x-2">
                <DebouncedInput
                    type="number"
                    min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
                    max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
                    value={(columnFilterValue as [number, number])?.[0] ?? ''}
                    onChange={value =>
                        column.setFilterValue((old: [number, number]) => [value, old?.[1]])
                    }
                    placeholder={`Min ${column.getFacetedMinMaxValues()?.[0]
                        ? `(${column.getFacetedMinMaxValues()?.[0]})`
                        : ''
                        }`}
                    className="w-24 border shadow rounded"
                />
                <DebouncedInput
                    type="number"
                    min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
                    max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
                    value={(columnFilterValue as [number, number])?.[1] ?? ''}
                    onChange={value =>
                        column.setFilterValue((old: [number, number]) => [old?.[0], value])
                    }
                    placeholder={`Max ${column.getFacetedMinMaxValues()?.[1]
                        ? `(${column.getFacetedMinMaxValues()?.[1]})`
                        : ''
                        }`}
                    className="w-24 border shadow rounded"
                />
            </div>
            <div className="h-1" />
        </div>
    ) : (
        <>
            <datalist id={column.id + 'list'}>
                {sortedUniqueValues.slice(0, 5000).map((value: any) => (
                    <option value={value} key={value} />
                ))}
            </datalist>
            <DebouncedInput
                type="text"
                value={(columnFilterValue ?? '') as string}
                onChange={value => column.setFilterValue(value)}
                placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
                className="w-36 border shadow rounded"
                list={column.id + 'list'}
            />
            <div className="h-1" />
        </>
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
        <input {...props} value={value} onChange={e => setValue(e.target.value)} />
    )
}
