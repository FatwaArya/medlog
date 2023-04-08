import { useEffect, useState } from "react";
import { DollarSignIcon } from "lucide-react";

import { api } from "@/utils/api";
import { readableDate, rupiah } from "@/utils/intlformat";

import { Stats, StatsProps } from "./stats";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

export const RevenueStats = () => {
    const { data: revenue, isLoading } = api.record.getStatRevenue.useQuery();
    const [stats, setStats] = useState<StatsProps>({
        header: {
            title: "Revenue",
            icon: DollarSignIcon,
            bgColor: "bg-pink-200",
            color: "text-pink-500",
        },
        stats: {
            value: "Rp 0",
            metadata: {
                "Last Transaction": readableDate.format(new Date("1-1-2000"))
            }
        }
    });

    useEffect(() => {
        if (!isLoading && revenue) {
            setStats({
                header: stats.header,
                stats: {
                    value: rupiah.format(revenue.total!),
                    metadata: {
                        "Last Transaction": readableDate.format(revenue.lastRevenue.createdAt!)
                    }
                }
            })
        }
    }, [isLoading, revenue]);

    if (isLoading) return <LoadingOverlay children={<Stats {...stats} />} />;

    return <Stats {...stats} />
}