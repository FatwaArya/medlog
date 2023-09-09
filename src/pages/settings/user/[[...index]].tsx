import SettingsLayout from "@/components/settings/layout";
import { Separator } from "@/components/ui/separator";
import { type PasienPlusPage } from "@/pages/_app";
import { UserProfile } from "@clerk/nextjs";
import Head from "next/head";
import { type ReactElement } from "react";

const UserPage: PasienPlusPage = () => {
    return (
        <>
            <Head>
                <title>Profil Pengguna | Pasien Plus</title>
            </Head>
            <div className="space-y-3 space-x-6 ">
                <UserProfile path="/settings/user" routing="path" appearance={{
                    elements: {
                        card: {
                            //remove border radius and shadow
                            borderRadius: "0px",
                            margin: "0px",
                            boxShadow: "none",
                        },
                        pageScrollBox: {
                            // remove padding on mobile
                            padding: "0px",
                            margin: "0px",
                        },
                        page: {
                            margin: "0px",
                        },
                        navbarMobileMenuButton: {
                            //hide the mobile menu
                            display: "none",
                        }
                    }
                }} />
            </div>
        </>
    )
}

UserPage.getLayout = function getLayout(page: ReactElement) {
    return <SettingsLayout>{page}</SettingsLayout>
}

export default UserPage;


