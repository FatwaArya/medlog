import Layout from "@/components/dashboard/Layout";
import { PasienPlusPage } from "@/pages/_app";
import { ReactElement } from "react";
import AdminList from "@/components/home/lists/admin";
import Breadcrumbs from "@/components/ui/breadcrumb";
import Head from "next/head";


const Admin: PasienPlusPage = () => {

    return (
        <>
            <Head>
                <title>Pasien Plus | Data Admin</title>
            </Head>
            <Breadcrumbs />
            <AdminList />
        </>
    )
}

export default Admin

Admin.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>
}