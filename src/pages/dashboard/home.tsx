import { StatsUser } from "@/components/dashboard/stats/stats";
import { api } from "@/utils/api";

export default function Home() {
    const { data: Revenue } = api.record.getStatRevenue.useQuery()



    return (
        <>
            <StatsUser lastRevenue={Revenue?.lastRevenue} total={Revenue?.total as number} name='Revenue' />
        </>
    );
}
