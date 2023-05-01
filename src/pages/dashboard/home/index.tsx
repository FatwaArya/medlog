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

const Home: PasienPlusPage = () => {
    const { data: session } = useSession();
    console.log(session)
    const { data: subsData } = api.subscription.create.useQuery()
    // console.log(subsData)
    useEffect(() => {
        // You can also change below url value to any script url you wish to load, 
        // for example this is snap.js for Sandbox Env (Note: remove `.sandbox` from url if you want to use production version)
        const midtransScriptUrl = 'https://app.sandbox.midtrans.com/snap/snap.js';

        const scriptTag = document.createElement('script');
        scriptTag.src = midtransScriptUrl;

        // Optional: set script attribute, for example snap.js have data-client-key attribute 
        // (change the value according to your client-key)
        const myMidtransClientKey = env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
        scriptTag.setAttribute('data-client-key', myMidtransClientKey);

        document.body.appendChild(scriptTag);

        return () => {
            document.body.removeChild(scriptTag);
        }
    }, []);
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
                    window.snap.pay(subsData?.token, {
                        onSuccess: function (result) {
                            /* You may add your own implementation here */
                            alert("payment success!"); console.log(result);
                        },
                        onPending: function (result) {
                            /* You may add your own implementation here */
                            alert("wating your payment!"); console.log(result);
                        },
                        onError: function (result) {
                            /* You may add your own implementation here */
                            alert("payment failed!"); console.log(result);
                        },
                        onClose: function () {
                            /* You may add your own implementation here */
                            alert('you closed the popup without finishing the payment');
                        }
                    })
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