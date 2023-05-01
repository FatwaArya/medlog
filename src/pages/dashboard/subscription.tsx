import { getServerAuthSession } from "@/server/auth";
import { PasienPlusPage } from "../_app"
import { GetServerSidePropsContext } from "next/types";

const Subscription: PasienPlusPage = () => {
    return (
        <div>
            <h1>Subscription</h1>
        </div>

    )
}

export default Subscription;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const session = await getServerAuthSession(ctx);

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

Subscription.authRequired = true

Subscription.isSubscriptionRequired = false