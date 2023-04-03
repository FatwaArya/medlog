import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Inter } from 'next/font/google'
export { reportWebVitals } from 'next-axiom';

import { api } from "@/utils/api";

import "@/styles/globals.css"

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (<>
    <style jsx global>{`
      html {
        font-family: ${inter.style.fontFamily};
      }
    `}</style>
    <SessionProvider session={session}>
      <main>
        <Component {...pageProps} />
      </main>
    </SessionProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
