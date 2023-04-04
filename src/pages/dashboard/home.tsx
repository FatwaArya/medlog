import { LineCharts } from "@/components/dashboard/charts/charts";
import PatientList from "@/components/dashboard/lists/patient";
import { StatsUser } from "@/components/dashboard/stats/stats";
import { api } from "@/utils/api";
import { useState } from "react";

export default function Home() {
    const { data: Revenue } = api.record.getStatRevenue.useQuery()
    const { data: Stats } = api.patient.getStatLine.useQuery()
    if (!Revenue) return null
    if (!Stats) return null
    return (
        <>
            <div className=" bg-slate-200 h-screen mb-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
                    <LineCharts />
                    <StatsUser lastRevenue={Revenue.lastRevenue} total={Revenue.total as number} name='Revenue' />
                </div>
                <PatientList />
            </div>

        </>
    );
}
