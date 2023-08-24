import { type AppType } from "next/app";
import { Inter } from 'next/font/google';
export { reportWebVitals } from 'next-axiom';


import { useEffect, type ReactElement, type ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

import { api } from "@/utils/api";

import "@/styles/globals.css"
import { Analytics } from '@vercel/analytics/react';
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import Head from "next/head";
import { ClerkLoaded, ClerkLoading, ClerkProvider, RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";
import { Loader } from "@/components/auth/AuthGuard";


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

const publicPages = ["/auth/sign-in/[[...index]]", "/auth/sign-up/[[...index]]", "/"];


const MyApp: AppType = ({
  Component,
  pageProps: { ...pageProps },
  router
}: PasienPlusProps) => {
  const getLayout = Component.getLayout ?? ((page) => page);
  const authRequired = Component.authRequired ?? false;

  const { pathname } = useRouter();

  const isPublicPage = publicPages.includes(pathname);

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
    <Toaster />
    <ClerkProvider {...pageProps}>
      <ClerkLoading>
        <Loader />
      </ClerkLoading>
      <ClerkLoaded>
        {/* {isPublicPage ? (
          <Component {...pageProps} />
        ) : (
          <> */}
        {/* <SignedIn> */}
        {getLayout(<Component {...pageProps} />)}
        {/* </SignedIn> */}
        {/* <SignedOut>
              <RedirectToSignIn />
            </SignedOut> */}
        {/* </>
        )} */}
      </ClerkLoaded>
    </ClerkProvider >

    <Analytics />
  </>
  );
};

export default api.withTRPC(MyApp);
