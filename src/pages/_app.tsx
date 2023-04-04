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

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export type NextPageWithLayoutOrAuth<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
  authRequired?: boolean
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayoutOrAuth
}

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);
  const authRequired = Component.authRequired ?? false;

  return (<>
    <style jsx global>{`
      html {
        font-family: ${inter.style.fontFamily};
      }
    `}</style>
    <SessionProvider session={session}>
      {
        authRequired ? (
          <AuthGuard>
            getLayout(<Component {...pageProps} />)
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
