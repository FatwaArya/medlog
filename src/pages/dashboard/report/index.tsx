import Layout from "@/components/dashboard/Layout";
import type { PasienPlusPage } from "@/pages/_app";
import Head from "next/head";
import ReportList from "@/components/report/list/report";
import Breadcrumbs from "@/components/ui/breadcrumb";


const Report: PasienPlusPage = () => {

    return (
        <>
            <Head>
                <title>
                    Pasien Plus | Laporan
                </title>
            </Head>
            <Breadcrumbs />
            <ReportList isDetailed={true} isPaginated pageSize={50} />

        </>
    )
}

export default Report

Report.authRequired = true

Report.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>
}
