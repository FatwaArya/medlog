import SettingsLayout from "@/components/settings/layout";
import { Separator } from "@/components/ui/separator";
import { PasienPlusPage } from "@/pages/_app";
import { UserProfile } from "@clerk/nextjs";
import Head from "next/head";
import { ReactElement } from "react";

const UserPage: PasienPlusPage = () => {
    return (
        <>
            <Head>
                <title>User Profile</title>
            </Head>
            <div className="space-y-3 space-x-6 ">
                <UserProfile path="/settings/user" routing="path" appearance={{
                    elements: {
                        card: {
                            //remove border radius and shadow
                            borderRadius: "0px",
                            boxShadow: "none",
                        },
                        pageScrollBox: {
                            paddingTop: "3px",
                            paddingLeft: "16px",
                            paddingRight: "16px",
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


