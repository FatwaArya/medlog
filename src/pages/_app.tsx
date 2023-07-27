import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Inter } from 'next/font/google';
export { reportWebVitals } from 'next-axiom';


import { useEffect, type ReactElement, type ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

import { api } from "@/utils/api";

import "@/styles/globals.css"
import AuthGuard from "@/components/auth/AuthGuard";
import { Toaster } from "react-hot-toast";
import { Analytics } from '@vercel/analytics/react';
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import AdminLayout from "@/components/dashboard/Layout";
import Head from "next/head";
import { env } from "@/env.mjs";

NProgress.configure({ showSpinner: false });

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export type PasienPlusPage<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
  authRequired?: boolean
  isSubscriptionRequired?: boolean
}

type PasienPlusProps = AppProps & {
  Component: PasienPlusPage
}

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
  router
}: PasienPlusProps) => {
  const getLayout = Component.getLayout ?? ((page) => page);
  const authRequired = Component.authRequired ?? false;

  useEffect(() => {
    const handleRouteStart = () => NProgress.start();
    const handleRouteDone = () => NProgress.done();

    router.events.on("routeChangeStart", handleRouteStart);
    router.events.on("routeChangeComplete", handleRouteDone);
    router.events.on("routeChangeError", handleRouteDone);

    return () => {
      // Make sure to remove the event handler on unmount!
      router.events.off("routeChangeStart", handleRouteStart);
      router.events.off("routeChangeComplete", handleRouteDone);
      router.events.off("routeChangeError", handleRouteDone);
    };
  }, []);

  return (<>

    <Head>
      {/* Set icon website using components */}
      <link rel="icon" href="/logo.svg" />
    </Head>

    <style jsx global>{`
      html {
        font-family: ${inter.style.fontFamily};
      }
    `}</style>


    <SessionProvider session={session}>
      <Toaster />
      {
        authRequired ? (
          <AuthGuard>
            {getLayout(<Component {...pageProps} />)}
          </AuthGuard>
        )
          : (
            getLayout(<Component {...pageProps} />)
          )
      }
    </SessionProvider>
    <Analytics />
  </>
  );
};

export default api.withTRPC(MyApp);
