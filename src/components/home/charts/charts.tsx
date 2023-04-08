import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RouterOutputs, api } from "@/utils/api";
import { useMemo, useState } from "react";
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import type { TooltipProps } from "recharts";
import {
    NameType,
    ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import dayjs from "dayjs";
import { useForm, Controller, useController } from "react-hook-form";

import relativeTime from "dayjs/plugin/relativeTime";
import { Loader2 } from "lucide-react";
// import localeData from "dayjs/plugin/localeData";
dayjs.extend(relativeTime);

enum Time {
    year = "year",
    month = "month",
    all = "all",
}

interface IForm {
    time: Time;
}

function CustomTooltip({
    payload,
    label,
    active,
}: TooltipProps<ValueType, NameType>) {
    if (active) {
        return (
            <div className="flex flex-col gap-3">
                <div className=" rounded-lg bg-[#3A6FF8] p-2 shadow-md">
                    <p className="text-md font-semibold text-white">
                        {payload?.[0]?.value} Patients
                    </p>
                </div>
                <div className=" rounded-lg bg-[#FF3366] p-2 shadow-md">
                    <p className="text-md font-semibold text-white">
                        {payload?.[1]?.value} Patients
                    </p>
                </div>
            </div>
        );
    }
    return null;
}

export const LineCharts = () => {
    const { control } = useForm<IForm>();
    const { field } = useController({
        name: "time",
        control,
        defaultValue: Time.month,
    });

    const { data, isLoading } = api.patient.getStatLine.useQuery({
        sortBy: field.value,
    });

    return (
        <div className="col-span-2 divide-gray-200 overflow-hidden rounded-lg bg-white shadow outline outline-1 outline-slate-200">
            <div className="px-4 pt-5 sm:px-6">
                <div className="flex items-center justify-between gap-2">
                    <p className="text-md font-semibold text-[#3366FF] sm:text-xl">
                        Patient Visits
                    </p>
                    <div className="flex flex-col gap-2 px-4 text-sm sm:flex-row sm:text-md">
                        <div className="flex items-center gap-1">
                            <span className=" block h-2 w-2 rounded-full bg-[#3366FF] ring-2 ring-white" />
                            Male
                        </div>
                        <div className="flex items-center gap-1">
                            <span className=" block h-2 w-2 rounded-full bg-[#FF3366] ring-2 ring-white" />
                            Female
                        </div>
                    </div>
                    <Controller
                        name="time"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange}>
                                <SelectTrigger className="w-[112px]" ref={field.ref}>
                                    <SelectValue placeholder="This Month" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="month">This Month</SelectItem>
                                        <SelectItem value="year">This Year</SelectItem>
                                        <SelectItem value="all" className="font-sans">
                                            All Time
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>
            </div>
            <div className="px-4 py-5 sm:p-6 overflow-auto">
                {/* if data is empty array show other things */}
                {data?.length === 0 ? (
                    <div className="flex h-[297px] items-center justify-center">
                        <p className="text-lg font-semibold text-[#BEBEBE]">No Patients</p>
                    </div>
                ) : isLoading ? (
                    <div className="flex h-[297px] items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : (
                    // <ResponsiveContainer
                    //     width="100%"
                    //     height={297}
                    // >
                    <LineChart data={data}
                        width={680}
                        height={297}
                    >
                        <CartesianGrid vertical={false} strokeDasharray="4" y={20} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            stroke="#BEBEBE"
                            tickMargin={10}
                        />
                        <YAxis
                            type="number"
                            includeHidden
                            stroke="#BEBEBE"
                            allowDecimals={false}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                            wrapperStyle={{ outline: "none" }}
                        />
                        <Line
                            type="monotone"
                            dataKey="Male"
                            stroke="#3366FF"
                            strokeWidth="2"
                            dot={false}
                        />
                        <Line
                            type="monotone"
                            dataKey="Female"
                            stroke="#FF3366"
                            strokeWidth="2"
                            dot={false}
                        />
                    </LineChart>
                    // </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};
