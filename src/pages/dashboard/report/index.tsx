import Layout from "@/components/dashboard/Layout";
import type { PasienPlusPage } from "@/pages/_app";
import Head from "next/head";
import ReportList from "@/components/report/list/report";
import { GetServerSidePropsContext } from "next/types";
import { getServerAuthSession } from "@/server/auth";


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



