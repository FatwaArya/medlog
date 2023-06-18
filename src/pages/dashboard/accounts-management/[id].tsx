import Layout from "@/components/dashboard/Layout";
import type { PasienPlusPage } from "@/pages/_app";
import { generateSSGHelper } from "@/server/api/helpers/ssgHelper";
import Head from "next/head";

import Breadcrumbs from "@/components/ui/breadcrumb";
import { api } from "@/utils/api";
import { Skeleton } from "@/components/ui/skeleton";
import { type GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "@/server/auth";
import { AdminDescription } from "@/components/accounts/detail";
import { SubsRecordList } from "@/components/checkup/lists/subsRecord";

const AdminDetail: PasienPlusPage<{ id: string }> = ({ id }) => {
    const { data: admin, isLoading } = api.admin.getUserById.useQuery({
        userId: id
    });
    console.log(admin);

    if (isLoading) {
        <div className="mb-4 overflow-hidden rounded-sm bg-white shadow outline-slate-200 sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
                <Skeleton className="h-6 w-12 whitespace-nowrap" />
                <Skeleton className="h-5 w-8 whitespace-nowrap" />
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                    {Array(4).fill(0).map((_, i) => (
                        <div key={i} className="sm:col-span-1">
                            <Skeleton className="h-5 whitespace-nowrap" />
                            <Skeleton className="h-5 whitespace-nowrap" />
                        </div>
                    ))}
                </dl>
            </div>
        </div>
    }

    if (!admin) {
        return (
            <div className="flex items-center justify-center">
                <h1 className="text-xl font-bold">Admin not found</h1>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>Pasien Plus | {admin?.name ?? "Admin not found"}</title>
            </Head>
            <Breadcrumbs patientName={admin?.name as string} isPatientLast />
            <AdminDescription {...admin} />
            <SubsRecordList userId={id} />
        </>
    )
};

export async function getServerSideProps(
    context: GetServerSidePropsContext<{ id: string }>
) {
    const session = await getServerAuthSession(context);

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


    const helpers = generateSSGHelper();
    const id = context.params?.id as string;

    // const reportExists = await helpers.admin.getUserById.fetch({
    //     userId: id,
    // })

    // if (reportExists) {
    //     await helpers.admin.getUserById.prefetch(
    //         { userId: id },
    //     )
    // } else {
    //     return {
    //         props: { id },
    //         notFound: true,
    //     };
    // }


    return {
        props: {
            trpcState: helpers.dehydrate(),
            id,
        },
    };
}

AdminDetail.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>
}

AdminDetail.authRequired = true

export default AdminDetail;