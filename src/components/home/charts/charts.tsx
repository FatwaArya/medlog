import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { api } from "@/utils/api";
import { Card, Title, LineChart, AreaChart } from "@tremor/react";
import type { TooltipProps } from "recharts";
import type {
    NameType,
    ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import dayjs from "dayjs";
import { useForm, Controller, useController } from "react-hook-form";
import { Skeleton } from "@/components/ui/skeleton";

import relativeTime from "dayjs/plugin/relativeTime";
import { Spinner } from "@/components/ui/loading-overlay";
// import localeData from "dayjs/plugin/localeData";
dayjs.extend(relativeTime);

enum Time {
    week = "week",
    year = "year",
    month = "month",
    all = "all",
}

interface IForm {
    time: Time;
}

function CustomTooltip({
    payload,
    active,
}: TooltipProps<ValueType, NameType>) {
    if (active) {
        //if one of the value is 0 then it will not show
        if (payload?.[0]?.value && !payload?.[1]?.value) {
            return (
                <div className="flex flex-col gap-3">
                    <div className=" rounded-lg bg-[#3A6FF8] p-2 shadow-md">
                        <p className="text-md font-semibold text-white">
                            {payload?.[0]?.value} Patients
                        </p>
                    </div>
                </div>
            );
        }
        if (payload?.[1]?.value && !payload?.[0]?.value) {
            return (
                <div className="flex flex-col gap-3">

                    <div className=" rounded-lg bg-[#FF3366] p-2 shadow-md">
                        <p className="text-md font-semibold text-white">
                            {payload?.[1]?.value} Patients
                        </p>
                    </div>
                </div>
            );
        }
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
        defaultValue: Time.week,
    });

    const { data, isLoading } = api.patient.getStatLine.useQuery({
        sortBy: field.value,
    });


    return (
        <div className="col-span-2 divide-gray-200 overflow-hidden rounded-lg bg-white shadow outline outline-1 outline-slate-200">
            <div className="px-4 pt-5 sm:px-6">
                <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-[#3366FF] sm:text-2xl leading-6  scroll-m-20 text-base tracking-tight ">
                        Kunjungan Pasien
                    </p>

                    <Controller
                        name="time"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange}>
                                <SelectTrigger className="w-[112px]" ref={field.ref}>
                                    <SelectValue placeholder="Minggu Ini" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="week">Minggu Ini</SelectItem>
                                        <SelectItem value="month">Bulan Ini</SelectItem>
                                        <SelectItem value="year">Tahun Ini</SelectItem>
                                        <SelectItem value="all" className="font-sans">
                                            Sepanjang Masa
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>
            </div>
            <div className="pl-1 pr-4 py-5 overflow-auto">
                {/* if data is empty array show other things */}
                {data?.length === 0 ? (
                    <div className="flex h-[297px] items-center justify-center">
                        <p className="text-lg font-semibold text-[#BEBEBE]">No Patients</p>
                    </div>
                ) : isLoading ? (
                    <div className="flex h-[297px] items-center justify-center">
                        <Skeleton className="h-full w-full ml-3" />
                    </div>
                ) : (
                    // <ResponsiveContainer
                    //     width="100%"
                    //     height={297}
                    // >
                    <AreaChart
                        className="mt-2"
                        data={data || []}
                        index="date"
                        categories={["Male", "Female"]}
                        colors={["blue", "pink"]}
                        noDataText="No Patients"

                        yAxisWidth={40}
                    />
                    // </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};
