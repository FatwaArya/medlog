import Layout from "@/components/dashboard/Layout";
import PatientList from "@/components/home/lists/patient";
import { type PasienPlusPage } from "@/pages/_app";
import { getServerAuthSession } from "@/server/auth";
import Head from "next/head";
import { GetServerSidePropsContext } from "next/types";
import { type ReactElement } from "react";
import Breadcrumbs from "@/components/ui/breadcrumb";


const Patients: PasienPlusPage = () => (
    <>
        <Head>
            <title>Pasien Plus | Data Pasien</title>
        </Head>
        <Breadcrumbs />
        <PatientList pageSize={50} isPaginated />
    </>
)
Patients.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>
}

Patients.authRequired = true;


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

export default Patients



