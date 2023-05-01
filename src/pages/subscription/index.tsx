import { getServerAuthSession } from "@/server/auth";
import type { PasienPlusPage } from "@/pages/_app";
import { type GetServerSidePropsContext } from "next/types";
import Layout from "@/components/dashboard/Layout";
import { type ReactElement } from "react";

const Subs = () => {
    return (
        <>
            <h1>Subs</h1>
        </>
    )
}





export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const session = await getServerAuthSession(ctx);

    if (!session) {
        return {
            redirect: {
                destination: '/auth/signin',
                permanent: false,
            },
        }
    }

    if (session?.user.isSubscribed) {
        return {
            redirect: {
                destination: '/dashboard/home',
                permanent: false,
            },
        }
    }

    return {
        props: {
            session,
        },
    }
}

export default Subs;
