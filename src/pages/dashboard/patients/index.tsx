import Layout from "@/components/dashboard/Layout";
import PatientList from "@/components/home/lists/patient";
import { type PasienPlusPage } from "@/pages/_app";
import Head from "next/head";
import { type ReactElement } from "react";


const Patients: PasienPlusPage = () => (
    <>
        <Head>
            <title>Pasien Plus | Data Pasien</title>
        </Head>
        <PatientList />
    </>
)
Patients.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>
}

Patients.authRequired = true;


export default Patients



