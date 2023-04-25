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
            title: "Pendapatan",
            icon: DollarSignIcon,
            bgColor: "bg-pink-200",
            color: "text-pink-600",
        },
        stats: {
            value: "Rp 0",
            metadata: {
                "Transaksi Terakhir": readableDate.format(new Date("1-1-2000")),
            },
        },
    });

    useEffect(() => {
        if (!isLoading && revenue) {
            setStats({
                header: stats.header,
                stats: {
                    value: rupiah.format(revenue.total!),
                    metadata: {
                        "Transaksi Terakhir": readableDate.format(
                            revenue.lastRevenue.createdAt!
                        ),
                    },
                },
            });
        }
    }, [isLoading, revenue]);

    if (isLoading)
        return (
            <LoadingOverlay>
                <Stats {...stats} /> {/* pass isHide to Stats */}
            </LoadingOverlay>
        );
    //blur background

    return (
        <Stats {...stats} />

    );
};

// Stats component remains the same
