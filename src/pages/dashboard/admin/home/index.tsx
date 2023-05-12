import Layout from "@/components/dashboard/Layout";
import { PasienPlusPage } from "@/pages/_app";
import { ReactElement } from "react";
import { type GetServerSidePropsContext } from "next/types";
import { getServerAuthSession } from "@/server/auth";
import { type Session } from "next-auth";

const Admin: PasienPlusPage = () => {
  return (
    <>
      <h1>Admin</h1>
    </>
  );
};

export default Admin;

Admin.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

