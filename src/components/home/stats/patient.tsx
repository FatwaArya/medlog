import { useEffect, useState } from "react";
import { UsersIcon } from "lucide-react";

import { api } from "@/utils/api";
import { readableDate } from "@/utils/intlformat";

import { Stats, type StatsProps } from "./stats";
import { LoadingStats } from "@/components/ui/loading-overlay";

export const PatientStats = () => {
    const { data: patient, isLoading } = api.patient.getStatPatients.useQuery();

    const [stats, setStats] = useState<StatsProps>({
        header: {
            title: "Total Pasien",
            icon: UsersIcon,
            bgColor: "bg-blue-200",
            color: "text-blue-600",
        },
        stats: {
            value: "0",
            metadata: {
                "Pemeriksaan Terakhir": readableDate.format(new Date("1-1-2000"))
            }
        }
    });

    useEffect(() => {
        if (!isLoading && patient) {
            setStats({
                header: stats.header,
                stats: {
                    value: `${patient.total!.toString()} Pasien`,
                    metadata: {
                        "Pemeriksaan Terakhir": readableDate.format(patient.lastVisit!)
                    }
                }
            })
        }
    }, [isLoading, patient]);

    if (isLoading) return <LoadingStats />;

    return <Stats {...stats} />
}