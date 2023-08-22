/* eslint-disable @typescript-eslint/ban-ts-comment */
import Layout from "@/components/dashboard/Layout";
import { env } from "@/env.mjs";
import { type PasienPlusPage } from "@/pages/_app";
import { api } from "@/utils/api";
import Head from "next/head";
import React, { type ReactElement, useEffect } from "react";

const Feedback: PasienPlusPage = () => {
    const { data: ssoToken } = api.canny.cannyUserToken.useQuery();

    useEffect(() => {
        // @ts-ignore
        (function (w, d, i, s) {
            // @ts-ignore
            function l() {
                // @ts-ignore
                if (!d.getElementById(i)) {
                    // @ts-ignore
                    const f = d.getElementsByTagName(s)[0],
                        e = d.createElement(s);
                    // @ts-ignore
                    e.type = "text/javascript";
                    // @ts-ignore
                    e.async = !0;
                    // @ts-ignore
                    e.src = "https://canny.io/sdk.js";
                    // @ts-ignore
                    f.parentNode.insertBefore(e, f);
                }
            }
            // @ts-ignore
            if ("function" != typeof w.Canny) {
                // @ts-ignore
                const c = function () {
                    // @ts-ignore
                    // eslint-disable-next-line prefer-rest-params
                    c.q.push(arguments);
                };
                // @ts-ignore
                c.q = [];
                // @ts-ignore
                w.Canny = c;
                // @ts-ignore
                "complete" === d.readyState
                    ? l()
                    // @ts-ignore
                    : w.attachEvent
                        // @ts-ignore
                        ? w.attachEvent("onload", l)
                        : w.addEventListener("load", l, !1);
            }
        })(window, document, "canny-jssdk", "script");


        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        Canny("render", {
            boardToken: env.NEXT_PUBLIC_BOARDTOKEN,
            basePath: "/dashboard/feedback",
            ssoToken: ssoToken, // See step 3,
            theme: "light", // options: light [default], dark, auto
        });

    }, [ssoToken]);

    return (
        <>
            <Head>
                <title>Pasien Plus | Kritik & Saran</title>
            </Head>
            <div>
                <div className="overflow-hidden bg-white shadow outline outline-1 outline-slate-200 sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <div data-canny />
                    </div>
                </div>

            </div>
        </>
    );
};

Feedback.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

Feedback.authRequired = true;


export default Feedback;
