import Head from "next/head";
import Link from "next/link";

import { AuthLayout } from "@/components/landing/AuthLayout";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/landing/Logo";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { GetServerSidePropsContext } from "next/types";
import { getServerAuthSession } from "@/server/auth";

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
          <div className="mt-20">
            <h2 className="text-lg font-semibold text-gray-900">
              Masuk ke akun anda
            </h2>
            <p className="mt-2 text-sm text-gray-700">
              Don’t have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-blue-600 hover:underline"
              >
                Sign up
              </Link>{" "}
              for a free trial.
            </p>
          </div>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-y-8">
          <Button variant='outline' onClick={() => {
            void signIn("google", { callbackUrl: "/dashboard/home" })
          }}>
            <FcGoogle className="mr-2 h-6 w-6" /> Masuk dengan Google
          </Button>
        </div>

      </AuthLayout>
    </>
  );
}


export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerAuthSession(ctx);
  //if session exists, redirect to dashboard
  if (session) {
    return {
      redirect: {
        destination: "/dashboard/home",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
}