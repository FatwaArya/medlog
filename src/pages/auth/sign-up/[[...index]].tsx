import { AuthLayout } from "@/components/landing/AuthLayout";
import { SignUp } from "@clerk/nextjs";
import Head from "next/head";

export default function Page() {
    return (
        <>
            <Head>
                <title>Sign Up - Pasien Plus</title>
            </Head>
            <AuthLayout>
                <div className="flex flex-col">
                    <SignUp />

                </div>
            </AuthLayout>
        </>

    )
}