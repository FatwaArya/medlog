import { RouterOutputs, api } from "@/utils/api";
import { useMemo, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { TooltipProps } from "recharts";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";



function CustomTooltip({ payload, label, active }: TooltipProps<ValueType, NameType>) {
    if (active) {
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
        <div className="w-96 h-96" >
            <ResponsiveContainer width={706} height={'99%'} className="bg-slate-300 rounded-sm">
                <LineChart data={data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="date" tickLine={false} />
                    <YAxis type="number" includeHidden allowDecimals={false} axisLine={false} tickLine={false} tickMargin={15} />
                    <Tooltip content={<CustomTooltip />} wrapperStyle={{ outline: "none" }} />
                    <Legend verticalAlign="top" iconType="circle" iconSize={8} />
                    <Line type="monotone" dataKey="Male" stroke="#3366FF" strokeWidth="2" dot={false} />
                    <Line type="monotone" dataKey="Female" stroke="#FF3366" strokeWidth="2" dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div >
    )


}