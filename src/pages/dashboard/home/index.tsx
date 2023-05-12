import { LineCharts } from "@/components/home/charts/charts";
import PatientList from "@/components/home/lists/patient";
import { type ReactElement } from "react";
import Breadcrumbs from "@/components/ui/breadcrumb";

import Layout from "@/components/dashboard/Layout";
import { type PasienPlusPage } from "@/pages/_app";
import { RevenueStats } from "@/components/home/stats/revenue";
import { PatientStats } from "@/components/home/stats/patient";
import Head from "next/head";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { GetServerSidePropsContext } from "next/types";
import { getServerAuthSession } from "@/server/auth";

const Home: PasienPlusPage = () => {
    const { data: user } = useSession()
    console.log(user)
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

            <PatientList pageSize={10} isPaginated={false} isDetailed={false} />
        </>
    );
}

export default Home;

Home.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>
}

Home.authRequired = true;

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getServerAuthSession(context);

    //not need to check session, because it will be redirect to login page if session is null
    //check role
    if (session?.user.role !== "admin") {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }

    return {
        props: {
            session,
        },
    };
}
