import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RouterOutputs, api } from "@/utils/api";
import { useMemo, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { TooltipProps } from "recharts";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";



function CustomTooltip({ payload, label, active }: TooltipProps<ValueType, NameType>) {
    if (active && payload && payload.length) {
        return (
            <div className=" p-2 shadow-md bg-[#3A6FF8] rounded-lg">
                <p className="text-white text-md font-semibold">{payload?.[0]?.value} Patients</p>
            </div>
        );
    }
    return null;
}

export const LineCharts = () => {
    const { data } = api.patient.getStatLine.useQuery()
    if (!data) return null

    return (
        // <div className="bg-white rounded-lg shadow-md overflow-hidden col-span-2 pb-4 px-4">
        //     <div className="w-full h-full sm:h-96 lg:h-80 xl:h-96 overflow-x-auto">

        //     </div>
        // </div>

        <div className="bg-white overflow-hidden shadow rounded-lg divide-gray-200 col-span-2">
            <div className="px-4 pt-5 sm:px-6">
                <div className="flex justify-between items-center">
                    <p className="text-xl text-[#3366FF] font-semibold">Patient Visits</p>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-1">
                            <span className=" block h-2 w-2 rounded-full ring-2 ring-white bg-[#3366FF]" />
                            Male
                        </div>
                        <div className="flex items-center gap-1">
                            <span className=" block h-2 w-2 rounded-full ring-2 ring-white bg-[#FF3366]" />
                            Female
                        </div>
                    </div>
                    <Select>
                        <SelectTrigger className="w-[112px]">
                            <SelectValue placeholder="This Year" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="apple" className="font-sans" >This Day</SelectItem>
                                <SelectItem value="banana">This Month</SelectItem>
                                <SelectItem value="pineapple">This Year</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="px-4 py-5 sm:p-6">
                <ResponsiveContainer width="100%" height={297}>
                    <LineChart data={data} >
                        <CartesianGrid vertical={false} strokeDasharray="4" />
                        <XAxis dataKey="date" tickLine={false} stroke="#BEBEBE" />
                        <YAxis type="number" includeHidden stroke="#BEBEBE" allowDecimals={false} axisLine={false} tickLine={false} tickMargin={15} />
                        <Tooltip content={<CustomTooltip />} wrapperStyle={{ outline: "none" }} />
                        <Line type="monotone" dataKey="Male" stroke="#3366FF" strokeWidth="2" dot={false} />
                        <Line type="monotone" dataKey="Female" stroke="#FF3366" strokeWidth="2" dot={false} />
                    </LineChart>
                </ResponsiveContainer></div>
        </div>



    )


}