import Layout from "@/components/dashboard/Layout";
import { type PasienPlusPage } from "@/pages/_app";
import { type ReactElement } from "react";
import Head from "next/head";
import UserList from "@/components/home/lists/user";


const accountsManagement: PasienPlusPage = () => {
    return (
        <>
            <Head>
                <title>Pasien Plus | Data Admin</title>
            </Head>
            {/* <Breadcrumbs /> */}
            <UserList />
        </>
    )
};

accountsManagement.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>
}

accountsManagement.authRequired = true;


export default accountsManagement;

