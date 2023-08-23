import { Container } from "@/components/landing/Container";
import { Plan, SwirlyDoodle } from "@/components/landing/Pricing";
import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { getAuth, buildClerkProps, clerkClient } from "@clerk/nextjs/server";
import { useRouter } from "next/router";
import { type GetServerSidePropsContext } from "next/types";
import { useEffect } from "react";
import toast from "react-hot-toast";

const Subs = () => {
    const router = useRouter();
    const { mutate, data: redirect, error } = api.subscription.subscribe.useMutation();


    useEffect(() => {
        if (error) {
            toast.error(error.message);
        }
        if (redirect) {
            router.push(redirect);
        }

    }, [error, redirect, router])

    return (
        <>
            <section
                id="pricing"
                aria-label="Pricing"
                className="bg-slate-900 py-20 sm:py-32"
            >

                <Container>
                    <div className="flex justify-between">
                        <Button
                            variant="outlineWhite"
                            onClick={() => {
                                router.push("/");
                            }}
                        >
                            Kembali
                        </Button>
                        <Button
                            variant="solidWhite"
                            onClick={() => {
                                router.push("/dashboard/home");
                            }}
                        >
                            Beranda
                        </Button>
                    </div>
                    <div className="md:text-center">
                        <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">

                            <span className="relative whitespace-nowrap">
                                <SwirlyDoodle className="absolute left-0 top-1/2 h-[1em] w-full fill-blue-400" />
                                <span className="relative">Harga simple,</span>
                            </span>{" "}
                            untuk semua.
                        </h2>
                        <p className="mt-4 text-lg text-slate-400">
                            PasienPlus menyediakan layanan lengkap untuk perawat online dan
                            memudahkannya dengan berbagai hal.
                        </p>
                    </div>
                    <div className="-mx-4 mt-16 grid max-w-2xl grid-cols-1 gap-y-10 sm:mx-auto lg:-mx-8 lg:max-w-none lg:grid-cols-3 xl:mx-0 xl:gap-x-8">
                        <Plan
                            name="Pemula"
                            price="Rp 35.000/bln"
                            description="Cocok untuk pemula yang ingin mencoba layanan aplikasi kami."
                            onClick={() => {
                                mutate({ plan: 'beginner' });
                            }}
                            features={[
                                "Tambah 5 pasien baru per hari",
                                "Tambah 25 checkup baru per hari (tanpa gambar)",
                                "Ekspor Laporan ",
                            ]}
                        />
                        <Plan
                            featured
                            name="Personal"
                            price="Rp 65.000/bln"
                            description="Bagi perawat mandiri yang ingin dimudahkan pekerjaannya."
                            onClick={() => {
                                mutate({ plan: 'personal' });
                            }}
                            features={[
                                "Tambah 35 pasien baru per hari",
                                "Tambah 100 checkup baru per hari",
                                "Ekspor data pasien",
                            ]}
                        />
                        <Plan
                            name="Professional"
                            price="Rp 150.000/bln"
                            description="Untuk skala perawat online yang lebih besar."
                            onClick={() => {
                                mutate({ plan: 'professional' });
                            }}
                            features={[
                                "Tambah tak terbatas pasien baru per hari",
                                "Tambah tak terbatas checkup baru per hari",
                                "Ekspor data pasien",
                                "Akses awal ke fitur baru"
                            ]}
                        />
                    </div>
                </Container>
            </section>
        </>
    )
}





export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const { userId } = getAuth(ctx.req);
    const user = userId ? await clerkClient.users.getUser(userId) : undefined;


    if (!userId || !user) {
        return {
            redirect: {
                destination: "/auth/sign-in?redirect_url=" + ctx.resolvedUrl,
                permanent: false,
            },
        };
    }


    if (user.publicMetadata.isSubscribed === true && user.publicMetadata.plan !== 'noSubscription') {
        return {
            redirect: {
                destination: '/dashboard/home',
                permanent: false,
            },
        }
    }

    return {
        props: { ...buildClerkProps(ctx.req, { user }) }
    };
}

export default Subs;
