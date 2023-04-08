import { useEffect, useState } from "react";
import { UsersIcon } from "lucide-react";

import { api } from "@/utils/api";
import { readableDate, rupiah } from "@/utils/intlformat";

import { Stats, StatsProps } from "./stats";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

export const PatientStats = () => {
    const { data: patient, isLoading } = api.patient.getStatPatients.useQuery();

    const [stats, setStats] = useState<StatsProps>({
        header: {
            title: "Total Patients",
            icon: UsersIcon,
            bgColor: "bg-blue-200",
            color: "text-blue-500",
        },
        stats: {
            value: "0",
            metadata: {
                "Last Visit": readableDate.format(new Date("1-1-2000"))
            }
        }
    });

    useEffect(() => {
        if (!isLoading && patient) {
            setStats({
                header: stats.header,
                stats: {
                    value: patient.total!.toString(),
                    metadata: {
                        "Last Visit": readableDate.format(patient.lastPatient.createdAt!)
                    }
                }
            })
        }
    }, [isLoading, patient]);

    if (isLoading) return <LoadingOverlay children={<Stats {...stats} />} />;

    return <Stats {...stats} />
}