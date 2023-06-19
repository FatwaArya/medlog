import { Button } from "@/components/ui/button";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { type GetServerSidePropsContext } from "next/types";

const Subs = () => {
    const { mutate } = api.subscription.subscribe.useMutation();
    const { data, status: sessionStatus } = useSession();

    return (
        <>
            {data?.user.email}
            <h1>Subs</h1>
            <Button onClick={() => {
                mutate({ plan: '1m' });
            }}>
                subscribe
            </Button>
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
