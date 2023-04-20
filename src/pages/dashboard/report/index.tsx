import Layout from "@/components/dashboard/Layout";
import type { PasienPlusPage } from "@/pages/_app";
import { CalendarDateRangePicker } from "@/components/ui/datepicker/calendarDateRangePicker";
import { CalendarDatePicker } from "@/components/ui/datepicker/calendarDatePicker";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { useState } from "react";
import { api } from "@/utils/api";
import Head from "next/head";
import ReportList from "@/components/report/list/report";


const Report: PasienPlusPage = () => {
    return (
        <>
            <Head>
                <title>
                    Pasien Plus | Laporan
                </title>
            </Head>

            <ReportList isDetailed={true} isPaginated />

        </>
    )
}

export default Report

Report.authRequired = true

Report.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>
}
