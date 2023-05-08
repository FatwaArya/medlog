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
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { PatternFormat } from "react-number-format";
import { forwardRef } from "react";
import type { PatternFormatProps } from "react-number-format";


interface ISignUp {
    name: string;
    email: string;
    password: string;
    phone: string;
}



export default function Login() {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors }, control } = useForm<ISignUp>();
    const { mutate } = api.user.register.useMutation({
        onSuccess(data, variables,) {
            signIn("credentials", {
                email: variables.email,
                password: variables.password,
                callbackUrl: "/dashboard/home",
            });
        },
        onError: (e) => toast.error(e.message),
    });
    const onSubmit: SubmitHandler<ISignUp> = async (data) => {
        mutate({
            name: data.name,
            phone: data.phone,
            email: data.email,
            password: data.password,
        })
    }

    //forward ref for numberic input


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
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <Label className="mb-2 block text-sm font-medium text-gray-700" >
                                        Nama Lengkap
                                    </Label>
                                    <Input
                                        {...register("name", { required: "Nama Lengkap tidak boleh kosong" })}
                                        id="name"
                                        name="name"
                                        type='text'
                                        autoComplete="given-name"
                                    />
                                    {errors.name && <span className="text-red-400 text-sm text-muted-foreground">{errors?.name.message}</span>}

                                </div>
                                <div>
                                    <Label className="mb-2 block text-sm font-medium text-gray-700" >
                                        No. Handphone
                                    </Label>
                                    <div className="relative mt-1 rounded-md shadow-sm">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <span className="text-gray-500 sm:text-sm">+62</span>
                                        </div>
                                        <Controller
                                            name='phone'
                                            control={control}
                                            render={({ field }) => (
                                                <PatternFormat
                                                    format="####-####-####"

                                                    customInput={Input}
                                                    onValueChange={(values) => {
                                                        field.onChange(values.value)
                                                    }}
                                                    className="block w-full rounded-md border-gray-300 bg-white pl-11 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"

                                                    autoComplete="phone"
                                                    id="phone-number"

                                                />
                                            )}
                                            rules={{
                                                required: 'Phone number is required',
                                                minLength: {
                                                    value: 10,
                                                    message: 'Phone number must be at least 10 characters long',
                                                },
                                                maxLength: {
                                                    value: 12,
                                                    message: 'Phone number must be at most 12 characters long',
                                                },
                                            }}
                                        />
                                        {errors.phone && <span className="text-red-400 text-sm text-muted-foreground">{errors.phone.message}</span>}
                                    </div>
                                </div>
                            </div>


                            <div>
                                <Label className="mb-2 block text-sm font-medium text-gray-700" >
                                    Email
                                </Label>
                                <Input
                                    {...register("email", { required: 'Email tidak boleh kosong' })}
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                />
                                {errors.email && <span className="text-red-400 text-sm text-muted-foreground">{errors.email.message}</span>}

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