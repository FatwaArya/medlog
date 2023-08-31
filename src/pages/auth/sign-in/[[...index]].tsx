import { AuthLayout } from "@/components/landing/AuthLayout";
import { SignIn } from "@clerk/nextjs";
import Head from "next/head";

export default function Page() {
    return (
        <>
            <Head>
                <title>Sign In - Pasien Plus</title>
            </Head>
            <AuthLayout>
                <SignIn appearance={{
                    elements: {
                        formField__emailAddress: {
                            backgroundColor: "#49247A",
                        }
                    },
                }} />
            </AuthLayout>
        </>

    );
}
