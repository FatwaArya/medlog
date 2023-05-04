import { LineCharts } from "@/components/home/charts/charts";
import PatientList from "@/components/home/lists/patient";
import { useEffect, type ReactElement } from "react";

import Layout from "@/components/dashboard/Layout";
import { type PasienPlusPage } from "@/pages/_app";
import { RevenueStats } from "@/components/home/stats/revenue";
import { PatientStats } from "@/components/home/stats/patient";
import Head from "next/head";
import { env } from "@/env.mjs";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const Home: PasienPlusPage = () => {
    const { data: session } = useSession();
    const router = useRouter();
    console.log(session)
    const { data: subsData } = api.subscription.create.useQuery()
    const { mutate, data } = api.subscription.createRecurring.useMutation()
    console.log(data)
    //if data.redirect_url is not null, redirect to that url
    useEffect(() => {
        if (data?.redirect_url) {
            router.push(data.redirect_url)
        }
    }, [data])






    return (
        <>
            <Head>
                <title>Pasien Plus | Dashboard</title>
            </Head>
            <div className="">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <LineCharts />
                    <div className="grid grid-rows-1 md:grid-rows-2 gap-4 col-span-2 md:col-span-1">
                        <RevenueStats />
                        <PatientStats />
                    </div>
                </div>
            </div>
            {/* integrate with snap using button*/}
            <div className="flex justify-center">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    //@ts-ignore
                    // window.snap.pay(subsData?.token, {
                    //     onSuccess: function (result) {
                    //         /* You may add your own implementation here */
                    //         alert("payment success!"); console.log(result);
                    //     },
                    //     onPending: function (result) {
                    //         /* You may add your own implementation here */
                    //         alert("wating your payment!"); console.log(result);
                    //     },
                    //     onError: function (result) {
                    //         /* You may add your own implementation here */
                    //         alert("payment failed!"); console.log(result);
                    //     },
                    //     onClose: function () {
                    //         /* You may add your own implementation here */
                    //         alert('you closed the popup without finishing the payment');
                    //     }
                    // })
                    mutate()
                }}>Pay</button>
            </div>


            <PatientList pageSize={10} isPaginated={false} isDetailed={false} />
        </>
    );
}

export default Home;

Home.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>
}

Home.authRequired = true;

Home.isSubscriptionRequired = true;
