import Layout from "@/components/dashboard/Layout";
import PatientList from "@/components/home/lists/patient";
import { type PasienPlusPage } from "@/pages/_app";
import Head from "next/head";
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


export default Patients

Patients.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>
}

Patients.authRequired = true;
