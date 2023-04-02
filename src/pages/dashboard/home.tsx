import { LineCharts } from "@/components/dashboard/charts/charts";
import { StatsUser } from "@/components/dashboard/stats/stats";
import { api } from "@/utils/api";

export default function Home() {
    const { data: Revenue } = api.record.getStatRevenue.useQuery()
    if (!Revenue) return null

    return (
        <>
            <div className=" bg-slate-200 h-screen mb-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
                    <LineCharts />
                    <StatsUser lastRevenue={Revenue.lastRevenue} total={Revenue.total as number} name='Revenue' />
                </div>

            </div>

        </>
    );
}
