import { LineCharts } from "@/components/dashboard/charts/charts";
import { StatsUser } from "@/components/dashboard/stats/stats";
import { api } from "@/utils/api";

export default function Home() {
    const { data: Revenue } = api.record.getStatRevenue.useQuery()
    if (!Revenue) return null

    return (
        <>
            <StatsUser lastRevenue={Revenue.lastRevenue} total={Revenue.total as number} name='Revenue' />
            <LineCharts />
        </>
    );
}
