import Layout from "@/components/dashboard/Layout";
import { PasienPlusPage } from "@/pages/_app";
import { getServerAuthSession } from "@/server/auth";
import { GetServerSidePropsContext } from "next";
import { ReactElement } from "react";
import { Camera } from 'lucide-react';
import Head from "next/head";
import Breadcrumbs from "@/components/ui/breadcrumb";
import AdminList from "@/components/home/lists/admin";


const accountsManagement: PasienPlusPage = () => {
    return (
        <>
            <Head>
                <title>Pasien Plus | Data Admin</title>
            </Head>
            <Breadcrumbs />
            <AdminList />
        </>
    )
};

accountsManagement.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>
}

accountsManagement.authRequired = true;
accountsManagement.isSubscriptionRequired = true;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const session = await getServerAuthSession(ctx);

    if (!session) {
        return {
            redirect: {
                destination: "/auth/signin",
                permanent: false,
            },
        };
    }
    if (session?.user?.role === "user") {
        return {
            redirect: {
                destination: "/dashboard/home",
                permanent: false,
            },
        };
    }


    return {
        props: { session },
    };
}

export default accountsManagement;

