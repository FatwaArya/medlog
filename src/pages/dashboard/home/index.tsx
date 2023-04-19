import { LineCharts } from "@/components/home/charts/charts";
import PatientList from "@/components/home/lists/patient";
import { api } from "@/utils/api";
import { ReactElement, useEffect, useState } from "react";

import Layout from "@/components/dashboard/Layout";
import { PasienPlusPage } from "@/pages/_app";
import { RevenueStats } from "@/components/home/stats/revenue";
import { PatientStats } from "@/components/home/stats/patient";
import Head from "next/head";
import CheckupList from "@/components/checkup/lists/checkup";
// import { CalendarDatePicker } from "@/components/ui/datepicker/calendarDatepicker";
// import { CalendarDateRangePicker } from "@/components/ui/datepicker/CalendarDateRangePicker";
import { CalendarDatePickerWithPresets } from "@/components/ui/datepicker/calendarDatePickerWithPresets";

const Home: PasienPlusPage = () => {
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
            <PatientList pageSize={10} isPaginated={false} isDetailed={false} />
        </>
    );
}

export default Home;

Home.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>
}

Home.authRequired = true;