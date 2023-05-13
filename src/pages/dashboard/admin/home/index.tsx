import Layout from "@/components/dashboard/Layout";
import { PasienPlusPage } from "@/pages/_app";
import { ReactElement } from "react";
import AdminList from "@/components/home/lists/admin";


const Admin: PasienPlusPage = () => {

    return (
        <>
            <AdminList />
        </>
    )
}

export default Admin

Admin.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>
}