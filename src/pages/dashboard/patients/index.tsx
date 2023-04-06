import Layout from "@/components/dashboard/Layout";
import PatientList from "@/components/home/lists/patient";
import { PasienPlusPage } from "@/pages/_app";
import { ReactElement } from "react";


const Patients: PasienPlusPage = () => {
    return (
        <>
            <div>
                <PatientList />
            </div>
        </>
    )
}


export default Patients

Patients.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>
}

Patients.authRequired = true;
