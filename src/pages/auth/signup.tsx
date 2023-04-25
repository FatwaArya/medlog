import Head from "next/head";
import Link from "next/link";

import { AuthLayout } from "@/components/landing/AuthLayout";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/landing/Logo";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { GetServerSidePropsContext } from "next/types";
import { getServerAuthSession } from "@/server/auth";
import { Input } from "@/components/ui/input";
import { SubmitHandler, useForm } from "react-hook-form";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";


interface ISignUp {
    name: string;
    email: string;
    password: string;
}

export default function Login() {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm<ISignUp>();
    const { mutate } = api.user.register.useMutation({
        onSuccess: () => router.push("/auth/signin"),
        onError: (e) => toast.error(e.message),
    });
    const onSubmit: SubmitHandler<ISignUp> = async (data) => {
        mutate({
            name: data.name,
            email: data.email,
            password: data.password,
        })
    }

    return (
        <>
            <Head>
                <title>Sign Up - TaxPal</title>
            </Head>
            <AuthLayout>
                <div className="flex flex-col items-start justify-start">
                    <Link href="/" legacyBehavior>
                        <a>
                            <Logo className="mb-2 h-10 w-auto" />
                        </a>
                    </Link>
                    <h2 className="mt-16 text-lg font-semibold text-gray-900">
                        Get started for free.
                    </h2>
                    <p className="mt-2 text-sm text-gray-700">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus arcu
                        odio pretium, semper adipiscing vitae nulla.
                    </p>
                </div>
                <div className="mt-10">
                    <div className="mt-6">
                        <form className="space-y-7" onSubmit={handleSubmit(onSubmit)}>
                            {/* error warning */}
                            <div>
                                <Label className="mb-2 block text-sm font-medium text-gray-700" >
                                    Nama Lengkap
                                </Label>
                                <Input
                                    {...register("name", { required: true })}
                                    id="name"
                                    name="name"
                                    type='text'
                                    autoComplete="given-name"
                                />
                                {errors.name && <span className="text-red-400 text-sm text-muted-foreground">{errors?.name.message}</span>}

                            </div>

                            <div>
                                <Label className="mb-2 block text-sm font-medium text-gray-700" >
                                    Email
                                </Label>
                                <Input
                                    {...register("email", { required: true })}
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                />
                                {errors.email && <span className="text-red-400 text-sm text-muted-foreground">Email harus diisi</span>}

                            </div>

                            <div>
                                <Label className="mb-2 block text-sm font-medium text-gray-700" >
                                    Password
                                </Label>
                                <Input
                                    {...register("password", { required: true })}
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                />
                                {errors.password && <span className="text-red-400 text-sm text-muted-foreground">Password harus diisi</span>}

                            </div>

                            <div className="pt-1">
                                <button
                                    type="submit"
                                    className="w-full rounded-full border border-transparent bg-blue-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    Sign up <span aria-hidden="true">&rarr;</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </AuthLayout>
        </>
    )
}