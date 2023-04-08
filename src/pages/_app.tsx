import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Inter } from 'next/font/google'
export { reportWebVitals } from 'next-axiom';

import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

import { api } from "@/utils/api";

import "@/styles/globals.css"
import AuthGuard from "@/components/auth/AuthGuard";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export type PasienPlusPage<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
  authRequired?: boolean
}

type PasienPlusProps = AppProps & {
  Component: PasienPlusPage
}

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}: PasienPlusProps) => {
  const getLayout = Component.getLayout ?? ((page) => page);
  const authRequired = Component.authRequired ?? false;

  return (<>
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
        ) : (
          getLayout(<Component {...pageProps} />)
        )
      }
    </SessionProvider>
  </>
  );
};

export default api.withTRPC(MyApp);
