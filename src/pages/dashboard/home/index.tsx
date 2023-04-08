import { LineCharts } from "@/components/home/charts/charts";
import PatientList from "@/components/home/lists/patient";
import { StatsUser } from "@/components/home/stats/stats";
import { api } from "@/utils/api";
import { ReactElement, useState } from "react";

import Layout from "@/components/dashboard/Layout";
import { Loader } from "@/components/auth/AuthGuard";
import { PasienPlusPage } from "@/pages/_app";

const Home: PasienPlusPage = () => {
    const { data: Revenue, isLoading } = api.record.getStatRevenue.useQuery()

    if (!Revenue || isLoading) {
        return <Loader />
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <LineCharts />
                <div className="grid grid-rows-1 md:grid-rows-2 gap-8">
                    <StatsUser lastRevenue={Revenue.lastRevenue} total={Revenue.total as number} name='Revenue' />
                    <StatsUser lastRevenue={Revenue.lastRevenue} total={Revenue.total as number} name='Revenue' />
                </div>
            </div>
            <PatientList />
        </>
    );
}

export default Home;

Home.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>
}

Home.authRequired = true;