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
            {/* <Breadcrumbs /> */}
            <ReportList />

        </>
    )
}
Report.authRequired = true

Report.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>
}


export default Report



