import Layout from "@/components/dashboard/Layout";
import PatientList from "@/components/home/lists/patient";
import { PasienPlusPage } from "@/pages/_app";
import Head from "next/head";
import { ReactElement } from "react";


const Patients: PasienPlusPage = () => (
    <>
        <Head>
            <title>Pasien Plus | Patients</title>
        </Head>
        <PatientList />
    </>
)


export default Patients

Patients.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>
}

Patients.authRequired = true;
