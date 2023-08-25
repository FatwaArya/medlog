import { LineCharts } from "@/components/home/charts/charts";
import PatientList from "@/components/home/lists/patient";
import { type ReactElement } from "react";

import Layout from "@/components/dashboard/Layout";
import { type PasienPlusPage } from "@/pages/_app";
import { RevenueStats } from "@/components/home/stats/revenue";
import { PatientStats } from "@/components/home/stats/patient";
import Head from "next/head";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";


const Home: PasienPlusPage = () => {
    return (
        <>
            <Head>
                <title>Pasien Plus | Dashboard</title>
            </Head>
            <div className="">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <LineCharts />
                    <div className="grid grid-rows-1 md:grid-rows-2 gap-4 col-span-2 md:col-span-1">
                        <RevenueStats />
                        <PatientStats />
                    </div>
                </div>
            </div>

            <PatientList />
        </>
    );
}
Home.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>
}


// export async function getServerSideProps(ctx: GetServerSidePropsContext) {
//     const { userId } = getAuth(ctx.req);
//     const user = userId ? await clerkClient.users.getUser(userId) : undefined;


//     if (!userId || !user) {
//         return {
//             redirect: {
//                 destination: "/auth/sign-in?redirect_url=" + ctx.resolvedUrl,
//                 permanent: false,
//             },
//         };
//     }


//     if (user.publicMetadata.isSubscribed === false) {
//         return {
//             redirect: {
//                 destination: "/subscription",
//                 permanent: false,
//             },
//         };
//     }




//     return {
//         props: { ...buildClerkProps(ctx.req, { user }) }
//     };
// }

export default Home;



