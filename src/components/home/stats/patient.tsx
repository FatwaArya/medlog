import { useEffect, useState } from "react";
import { UsersIcon } from "lucide-react";

import { api } from "@/utils/api";
import { readableDate, rupiah } from "@/utils/intlformat";

import { Stats, StatsProps } from "./stats";

export const PatientStats = () => {
    const [stats, setStats] = useState<StatsProps | null>(null);
    const { data: patient, isLoading } = api.patient.getStatPatients.useQuery();

    useEffect(() => {
        if (!isLoading && patient) {
            setStats({
                header: {
                    title: "Patients",
                    icon: UsersIcon
                },
                stats: {
                    value: patient.total!.toString(),
                    metadata: {
                        "Last Visit": readableDate.format(patient.lastPatient.createdAt!)
                    }
                }
            })
        }
    }, [isLoading, patient]);

    if (!stats) return <div>Loading...</div>

    return <Stats {...stats} />
}