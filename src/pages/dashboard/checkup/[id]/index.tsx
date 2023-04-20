import Layout from "@/components/dashboard/Layout";
import type { PasienPlusPage } from "@/pages/_app";
import { generateSSGHelper } from "@/server/api/helpers/ssgHelper";
import { prisma } from "@/server/db";
import { api } from "@/utils/api";
import Head from "next/head";
import type { GetStaticPaths, GetStaticPropsContext } from "next/types";
import type { RouterOutputs } from "@/utils/api";
import { PatientDescription } from "./new";
import { Spinner } from "@/components/ui/loading-overlay";

type PatientInfo = NonNullable<RouterOutputs["record"]['getRecordById']>['patient']

const CheckupDetail: PasienPlusPage<{ id: string }> = ({ id }) => {
    const { data: report, isLoading } = api.record.getRecordById.useQuery({ id })

    if (isLoading) {
        return <div className="flex justify-center h-full items-center">
            <Spinner />
        </div>
    }

    if (!report) {
        return <div className="flex justify-center items-center">
            <h1 className="scroll-m-20 text-xl font-extrabold tracking-tight">Data pemeriksaan tidak ada</h1>
        </div>
    }
    return (
        <>
            <Head>
                <title>Pasien Plus | Detail Pemeriksaan {report?.patient.name}</title>
            </Head>
            <div>
                <PatientDescription {...report?.patient as PatientInfo} />
                <div className="bg-white overflow-hidden shadow sm:rounded-lg outline outline-1 outline-slate-200">
                    <div className="px-4 py-5 sm:p-6">

                    </div>
                </div>
            </div>
        </>
    );

};

export default CheckupDetail;

export async function getStaticProps(
    context: GetStaticPropsContext<{ id: string }>,
) {

    const ssg = generateSSGHelper();
    const id = context.params?.id as string;


    await ssg.record.getRecordById.prefetch({ id });

    return {
        props: {
            trpcState: ssg.dehydrate(),
            id,
        },
        revalidate: 1,
    };
}

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = await prisma.medicalRecord.findMany({
        select: {
            id: true,
        },
    });

    return {
        paths: paths.map((path) => ({
            params: {
                id: path.id,
            },
        })),

        fallback: 'blocking',
    };
};

CheckupDetail.authRequired = true;

CheckupDetail.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};
