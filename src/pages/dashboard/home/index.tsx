import { LineCharts } from "@/components/home/charts/charts";
import PatientList from "@/components/home/lists/patient";
import { api } from "@/utils/api";
import { ReactElement, useEffect, useState } from "react";

import Layout from "@/components/dashboard/Layout";
import { Loader } from "@/components/auth/AuthGuard";
import { PasienPlusPage } from "@/pages/_app";
import { RevenueStats } from "@/components/home/stats/revenue";

import { DollarSignIcon } from "lucide-react";

const Home: PasienPlusPage = () => {
    return (
        <>
            <div className="h-screen">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <LineCharts />
                    <div className="grid grid-rows-1 md:grid-rows-2 gap-4">
                        <RevenueStats />
                        <RevenueStats />
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