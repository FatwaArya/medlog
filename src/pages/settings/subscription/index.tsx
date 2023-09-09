import { Loader } from "@/components/auth/AuthGuard";
import SettingsLayout from "@/components/settings/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { type PasienPlusPage } from "@/pages/_app";
import { api } from "@/utils/api";
import { SubscriptionPlan } from "@prisma/client";
import dayjs from "dayjs";
import "dayjs/locale/id"; // ES 201import Head from "next/head";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, type ReactElement } from "react";
import toast from "react-hot-toast";
import z from "zod";


const subscriptionPlans = {
    personal: {
        name: "Personal",
        price: "Rp 65.000 per bulan",
    },
    professional: {
        name: "Professional",
        price: "Rp 150.000 per bulan",
    },
};


const userPlanSchema = z.object({
    plan: z.enum(["free", "personal", "professional"]),
    maxCheckup: z.string(),
    remainingCheckup: z.number(),
    maxPatient: z.string(),
    remainingPatient: z.number(),
    resetDate: z.string().nullable(),
}).transform((data) => {
    const { maxPatient, remainingPatient, maxCheckup, remainingCheckup, plan, resetDate } = data;

    const maxPatientText = maxPatient === "unlimited" ? "unlimited" : `${parseInt(maxPatient) - remainingPatient}/${maxPatient}`;
    const maxCheckupText = maxCheckup === "unlimited" ? "unlimited" : `${parseInt(maxCheckup) - remainingCheckup}/${maxCheckup}`;


    return {
        plan,
        patientUsage: maxPatientText,
        checkupUsage: maxCheckupText,
        resetDate: resetDate ? dayjs(parseInt(resetDate)).format("DD MMMM YYYY") : null,
    };
});

const CurrentPlanCard: React.FC<{ userPlan: z.infer<typeof userPlanSchema> }> = ({ userPlan }) => {
    return (
        <Card className="grid grid-cols-2 px-4 py-4">
            <CardHeader>
                <CardTitle className="font-normal text-base">
                    Langganan anda
                </CardTitle>
                <CardDescription>
                    Kelola dan lihat langganan anda.
                </CardDescription>
            </CardHeader>
            <CardContent className="py-7">
                <span className="text-md capitalize">
                    {userPlan.plan}
                </span>
                <div className="text-sm text-muted-foreground flex flex-col">
                    <div className="flex gap-2">
                        <span>
                            {userPlan.patientUsage}
                        </span>
                        <span>
                            Penggunaan pasien baru
                        </span>
                    </div>

                    <div className="flex gap-2">
                        <span>
                            {userPlan.checkupUsage}
                        </span>
                        <span>
                            Penggunaan periksa baru
                        </span>
                    </div>

                    {userPlan.resetDate && (
                        <span>
                            {userPlan.resetDate}
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

const SubscriptionCard: React.FC<{ userPlan: z.infer<typeof userPlanSchema> }> = ({ userPlan }) => {
    const router = useRouter();
    const { mutate, data: redirect, error } = api.subscription.subscribe.useMutation();

    useEffect(() => {
        if (error) {
            toast.error(error.message);
        }
        if (redirect) {
            router.push(redirect);
        }

    }, [error, redirect, router])



    return (
        <Card className="grid grid-cols-2 px-4 py-4">
            <CardHeader>
                <CardTitle className="font-normal text-base">
                    Langganan yang tersedia
                </CardTitle>
                <CardDescription>
                    Lihat langganan yang tersedia untuk anda.
                </CardDescription>
            </CardHeader>
            <CardContent className="py-7">
                <div className="grid grid-cols-1">
                    {Object.keys(subscriptionPlans).map((plan) => {
                        const { name, price } = subscriptionPlans[plan as Partial<keyof typeof subscriptionPlans>];


                        return (
                            <div key={name} className="flex flex-col mb-4 items-start">
                                <span className="text-md capitalize">
                                    {name}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    Mulai dari {price}
                                </span>

                                {plan === userPlan.plan ? (
                                    <span className="text-sm text-muted-foreground">
                                        Langganan anda saat ini
                                    </span>
                                ) : (
                                    plan === "free" ? null : (
                                        <button

                                            className="mt-2 "

                                            onClick={() => {
                                                mutate({ plan: plan as SubscriptionPlan });
                                            }}
                                        >
                                            <span className="text-md text-blue-500">
                                                Upgrade
                                            </span>
                                        </button>
                                    )
                                )}
                            </div>
                        )
                    }
                    )}
                </div>
            </CardContent>
        </Card>
    )
}


const SubcriptionPage: PasienPlusPage = () => {
    const { data, isLoading } = api.subscription.getUserPlan.useQuery({});

    if (isLoading) return <Loader />;

    const transformedUserPlan = userPlanSchema.parse(data);


    return (
        <>
            <Head>
                <title>Langganan | Pasien Plus</title>
            </Head>
            <div className="space-y-3 ">
                <h3 className="font-bold text-3xl mb-3">Langganan</h3>
                <p className="text-sm text-muted-foreground">
                    Kelola langganan anda disini.
                </p>
                <Separator />
                <CurrentPlanCard userPlan={transformedUserPlan} />
                <SubscriptionCard userPlan={transformedUserPlan} />
            </div>

        </>
    )
}

SubcriptionPage.getLayout = function getLayout(page: ReactElement) {
    return <SettingsLayout>{page}</SettingsLayout>
}

export default SubcriptionPage;
