import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RouterOutputs, api } from "@/utils/api";
import { useMemo, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { TooltipProps } from "recharts";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import dayjs from "dayjs";
import { useForm, Controller, useController } from "react-hook-form";


import relativeTime from "dayjs/plugin/relativeTime";
import { Loader2 } from "lucide-react";
// import localeData from "dayjs/plugin/localeData";
dayjs.extend(relativeTime);


enum Time {
    year = 'year',
    month = 'month',
    all = 'all',
}

interface IForm {
    time: Time
}

function CustomTooltip({ payload, label, active }: TooltipProps<ValueType, NameType>) {
    if (active) {
        return (<div className="flex gap-3 flex-col">
            <div className=" p-2 shadow-md bg-[#3A6FF8] rounded-lg">
                <p className="text-white text-md font-semibold">{payload?.[0]?.value} Patients</p>
            </div>
            <div className=" p-2 shadow-md bg-[#FF3366] rounded-lg">
                <p className="text-white text-md font-semibold">{payload?.[1]?.value} Patients</p>
            </div>
        </div>
        );
    }
    return null;
}

export const LineCharts = () => {
    const { control } = useForm<IForm>();
    const { field } = useController({
        name: 'time',
        control,
        defaultValue: Time.month
    })

    const { data, isLoading } = api.patient.getStatLine.useQuery({
        sortBy: field.value
    })

    return (
        <div className="bg-white overflow-hidden shadow rounded-lg divide-gray-200 col-span-2">
            <div className="px-4 pt-5 sm:px-6">
                <div className="flex justify-between items-center gap-2">
                    <p className="text-md sm:text-xl text-[#3366FF] font-semibold">Patient Visits</p>
                    <div className="flex gap-2">
                        <div className="flex items-center gap-1">
                            <span className=" block h-2 w-2 rounded-full ring-2 ring-white bg-[#3366FF]" />
                            Male
                        </div>
                        <div className="flex items-center gap-1">
                            <span className=" block h-2 w-2 rounded-full ring-2 ring-white bg-[#FF3366]" />
                            Female
                        </div>
                    </div>
                    <Controller name="time" control={control} render={({ field }) => (
                        <Select {...field} onValueChange={field.onChange}>
                            <SelectTrigger className="w-[112px]">
                                <SelectValue placeholder="This Year" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup >
                                    <SelectItem value="month">This Month</SelectItem>
                                    <SelectItem value="year">This Year</SelectItem>
                                    <SelectItem value="all" className="font-sans" >All Time</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>)} />
                </div>
            </div>
            <div className="px-4 py-5 sm:p-6">
                {/* if data is empty array show other things */}
                {data?.length === 0 ? <div className="flex items-center justify-center h-[297px]">
                    <p className="text-[#BEBEBE] text-lg font-semibold">No Patients</p>
                </div> : isLoading ? <div className="flex items-center justify-center h-[297px]">
                    <Loader2 className="animate-spin h-8 w-8" />
                </div> : <ResponsiveContainer width="100%" height={297} className="flex items-center justify-center">
                    <LineChart data={data} >
                        <CartesianGrid vertical={false} strokeDasharray="4" y={20} />
                        <XAxis dataKey="date" tickLine={false} stroke="#BEBEBE" tickMargin={10} />
                        <YAxis type="number" includeHidden stroke="#BEBEBE" allowDecimals={false} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} wrapperStyle={{ outline: "none" }} />
                        <Line type="monotone" dataKey="Male" stroke="#3366FF" strokeWidth="2" dot={false} />
                        <Line type="monotone" dataKey="Female" stroke="#FF3366" strokeWidth="2" dot={false} />
                    </LineChart>
                </ResponsiveContainer>
                }
            </div>
        </div>



    )


}