import Layout from "@/components/dashboard/Layout";
import type { PasienPlusPage } from "@/pages/_app";
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
            <ReportList isDetailed={true} isPaginated pageSize={50} />

        </>
    )
}

export default Report

Report.authRequired = true

Report.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>
}
Report.isSubscriptionRequired = true
