import CheckupList from "@/components/checkup/lists/checkup";
import Layout from "@/components/dashboard/Layout";
import type { PasienPlusPage } from "@/pages/_app";
import Head from "next/head";



const Checkups: PasienPlusPage = () => {
    return (
        <>
            <Head>
                <title>Pasien Plus | Data Pemeriksaan</title>
            </Head>
            <CheckupList isPaginated={true} pageSize={50} />
        </>
    )
}

export default Checkups

Checkups.authRequired = true

Checkups.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>
}