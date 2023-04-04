import { LineCharts } from "@/components/home/charts/charts";
import PatientList from "@/components/home/lists/patient";
import { StatsUser } from "@/components/home/stats/stats";
import { api } from "@/utils/api";
import { ReactElement, useState } from "react";
import { PasienPlusPage } from "../_app";
import Layout from "@/components/dashboard/Layout";

const Home: PasienPlusPage = () => {
    const { data: Revenue } = api.record.getStatRevenue.useQuery()
    const { data: Stats } = api.patient.getStatLine.useQuery()
    if (!Revenue) return null
    if (!Stats) return null
    return (
        <>
            <div className="h-screen">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <LineCharts />
                    <div className="grid grid-rows-1 md:grid-rows-2 gap-8">
                        <StatsUser lastRevenue={Revenue.lastRevenue} total={Revenue.total as number} name='Revenue' />
                        <StatsUser lastRevenue={Revenue.lastRevenue} total={Revenue.total as number} name='Revenue' />
                    </div>

                </div>
                <PatientList />
            </div>

        </>
    );
}

export default Home;

Home.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>
}

Home.authRequired = true;