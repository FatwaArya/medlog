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
                        // formButtonPrimary: {
                        //     fontSize: 14,
                        //     textTransform: "none",
                        //     backgroundColor: "#611BBD",
                        //     "&:hover, &:focus, &:active": {
                        //         backgroundColor: "#49247A",
                        //     },
                        // },
                        formField__emailAddress: {
                            backgroundColor: "#49247A",
                        }
                    },
                }} />
            </AuthLayout>
        </>

    );
}
