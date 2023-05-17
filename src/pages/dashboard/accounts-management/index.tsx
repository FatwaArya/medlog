import Layout from "@/components/dashboard/Layout";
import { PasienPlusPage } from "@/pages/_app";
import { getServerAuthSession } from "@/server/auth";
import { GetServerSidePropsContext } from "next";
import { ReactElement } from "react";
import { Camera } from 'lucide-react';


const accountsManagement = () => {
    return (
        <>
            <Camera color="red" size={48} />
            <h1>accountsManagement</h1>
        </>
    );
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