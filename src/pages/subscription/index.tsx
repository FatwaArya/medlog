import { getServerAuthSession } from "@/server/auth";
import { type GetServerSidePropsContext } from "next/types";

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

    if (session?.user.isSubscribed === true) {
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
