import { LineCharts } from "@/components/home/charts/charts";
import PatientList from "@/components/home/lists/patient";
import { useEffect, type ReactElement } from "react";
import Breadcrumbs from "@/components/ui/breadcrumb";

import Layout from "@/components/dashboard/Layout";
import { type PasienPlusPage } from "@/pages/_app";
import { RevenueStats } from "@/components/home/stats/revenue";
import { PatientStats } from "@/components/home/stats/patient";
import Head from "next/head";
import { env } from "@/env.mjs";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "@/server/auth";

const Home: PasienPlusPage = () => {
    return (
        <>
            <Head>
                <title>Pasien Plus | Dashboard</title>
            </Head>
            <div className="">
                <Breadcrumbs />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <LineCharts />
                    <div className="grid grid-rows-1 md:grid-rows-2 gap-4 col-span-2 md:col-span-1">
                        <RevenueStats />
                        <PatientStats />
                    </div>
                </div>
            </div>

            <PatientList />
        </>
    );
}
Home.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>
}

Home.authRequired = true;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const session = await getServerAuthSession(ctx);

    if (!session) {
        return {
            redirect: {
                destination: "/auth/signin",
                permanent: false,
            },
        };
    }

    if (session?.user?.isSubscribed === false) {
        return {
            redirect: {
                destination: "/subscription",
                permanent: false,
            },
        };
    }


    return {
        props: { session },
    };
}

export default Home;



