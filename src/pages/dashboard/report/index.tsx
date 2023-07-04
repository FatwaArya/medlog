import Layout from "@/components/dashboard/Layout";
import type { PasienPlusPage } from "@/pages/_app";
import Head from "next/head";
import ReportList from "@/components/report/list/report";
import { type GetServerSidePropsContext } from "next/types";
import { getServerAuthSession } from "@/server/auth";
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
            <ReportList />

        </>
    )
}
Report.authRequired = true

Report.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>
}
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

    if (session?.user?.isNewUser) {
        return {
            redirect: {
                destination: "/auth/onboarding",
                permanent: false,
            },
        };
    }

    if (session?.user?.isSubscribed === false) {
        return {
            redirect: {
                destination: "/subscription",
                permanent: false,
            },
        };
    }



    return {
        props: { session },
    };
}

export default Report



