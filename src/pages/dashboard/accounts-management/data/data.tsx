import { CheckCircle, XCircle } from "lucide-react"
import { SubscriptionStatus } from "@prisma/client"

export const statuses = [
    {
        value: SubscriptionStatus.active,
        label: "Aktif",
        icon: CheckCircle
    },
    {
        value: SubscriptionStatus.inactive,
        label: "Tidak aktif",
        icon: XCircle
    },
]