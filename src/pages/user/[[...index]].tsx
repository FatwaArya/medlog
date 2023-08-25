import { UserProfile } from "@clerk/nextjs";
import Head from "next/head";

const UserPage = () => {
    return (
        <>
            <Head>
                <title>User Profile</title>
            </Head>
            <UserProfile path="/user" routing="path" appearance={{
                elements: {
                    card: {
                        //remove border radius and shadow
                        borderRadius: "0px",
                        boxShadow: "none",
                    }
                }
            }} />
        </>
    )
}

export default UserPage;

