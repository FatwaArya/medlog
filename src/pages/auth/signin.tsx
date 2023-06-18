import Head from "next/head";
import Link from "next/link";

import { AuthLayout } from "@/components/landing/AuthLayout";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/landing/Logo";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function Login() {
  return (
    <>
      <Head>
        <title>Sign In - TaxPal</title>
      </Head>
      <AuthLayout>
        <div className="flex flex-col ">
          <Link href="/" aria-label="Home">
            <Logo className="h-10 w-auto" />
          </Link>
          <div className="mt-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Masuk ke akun anda
            </h2>
          </div>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-y-8">
          <div className="flex flex-col">
            <Input type="email" placeholder="jono@example.com" disabled />
            <Button
              className="mt-3 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              variant="outline"
              disabled
            >
              Masuk dengan email
            </Button>
          </div>
          <Separator />
          <Button
            variant="outline"
            // focusring
            className="focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={() => {
              void signIn("google", { callbackUrl: "/dashboard/home" });
            }}
          >
            <FcGoogle className="mr-2 h-6 w-6" /> Masuk dengan Google
          </Button>
        </div>
      </AuthLayout>
    </>
  );
}

// export async function getServerSideProps(ctx: GetServerSidePropsContext) {
//   const session = await getServerAuthSession(ctx);
//   //if session exists, redirect to dashboard
//   if (session) {
//     return {
//       redirect: {
//         destination: "/dashboard/home",
//         permanent: false,
//       },
//     };
//   }
//   return {
//     props: {},
//   };
// }
