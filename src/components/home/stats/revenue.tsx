import { useEffect, useState } from "react";
import { DollarSignIcon } from "lucide-react";

import { api } from "@/utils/api";
import { readableDate, rupiah } from "@/utils/intlformat";

import { Stats, StatsProps } from "./stats";

export const RevenueStats = () => {
    const [stats, setStats] = useState<StatsProps | null>(null);
    const { data: revenue, isLoading } = api.record.getStatRevenue.useQuery();

    useEffect(() => {
        if (!isLoading && revenue) {
            setStats({
                header: {
                    title: "Revenue",
                    icon: DollarSignIcon
                },
                stats: {
                    value: rupiah.format(revenue.total!),
                    metadata: {
                        "Last Transaction": readableDate.format(revenue.lastRevenue.createdAt!)
                    }
                }
            })
        }
    }, [isLoading, revenue]);

    if (!stats) return <div>Loading...</div>

    return <Stats {...stats} />
}