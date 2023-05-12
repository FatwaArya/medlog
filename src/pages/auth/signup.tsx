"use client";
import Head from "next/head";
import Link from "next/link";

import { AuthLayout } from "@/components/landing/AuthLayout";
import { Logo } from "@/components/landing/Logo";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { type SubmitHandler, useForm, Controller } from "react-hook-form";
import { api } from "@/utils/api";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { PatternFormat } from "react-number-format";
import { useState } from "react";
import { CheckIcon, Info as InfoIcon } from "lucide-react";

interface ISignUp {
  name: string;
  email: string;
  password: string;
  phone: string;
}

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ISignUp>();
  const { mutate } = api.user.register.useMutation({
    onSuccess(data, variables) {
      signIn("credentials", {
        email: variables.email,
        password: variables.password,
        callbackUrl: "/dashboard/home",
      });
    },

    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.password;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error(e.message);
      }
    },
  });

  const onSubmit: SubmitHandler<ISignUp> = async (data) => {
    mutate({
      name: data.name,
      phone: data.phone,
      email: data.email,
      password: data.password,
    });
  };
  const [requirements, setRequirements] = useState([
    {
      id: 1,
      text: "Password harus mengandung minimal 8 karakter",
      isMet: false,
    },

    {
      id: 2,
      text: "Password harus mengandung minimal 1 angka",
      isMet: false,
    },
    {
      id: 3,
      text: "Campuran huruf besar dan kecil",
      isMet: false,
    },
  ]);

  const handlePasswordChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const password = e.target.value;
    setRequirements((prev) =>
      prev.map((req) => {
        switch (req.id) {
          case 1:
            return { ...req, isMet: password.length >= 8 };
          case 2:
            return {
              ...req,
              isMet: /[A-Z]/.test(password) && /[a-z]/.test(password),
            };
          case 3:
            return { ...req, isMet: /[0-9]/.test(password) };
          default:
            return req;
        }
      })
    );
  };

  console.log(requirements);

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
          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            Get started for free.
          </h2>
          <p className="mt-2 text-sm text-gray-700">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus arcu
            odio pretium, semper adipiscing vitae nulla.
          </p>
        </div>
        <div className="mt-10">
          <div className="mt-6">
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              {/* <div className="grid grid-cols-2 gap-2"> */}
              <div>
                <Label className="mb-2 block text-sm font-medium text-gray-700">
                  Nama Lengkap
                </Label>
                <Input
                  {...register("name", {
                    required: "Nama tidak boleh kosong",
                  })}
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="given-name"
                  style={{ minHeight: "2.5rem" }} // add this style
                />
                {errors.name && (
                  <span className="mt-1 flex items-center gap-x-2 text-sm">
                    <InfoIcon className="h-4 w-4 text-red-800" />
                    {errors?.name.message}
                  </span>
                )}
              </div>
              <div>
                <Label className="mb-2 block text-sm font-medium text-gray-700">
                  Nomor Telepon (Whatsapp)
                </Label>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <PatternFormat
                      format="####-####-####"
                      customInput={Input}
                      onValueChange={(values) => {
                        field.onChange(values.value);
                      }}
                      className="block w-full rounded-md border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      autoComplete="phone"
                      id="phone-number"
                      style={{ minHeight: "2.5rem" }} // add this style
                    />
                  )}
                  rules={{
                    required: "Nomor telepon tidak boleh kosong",
                    minLength: {
                      value: 10,
                      message:
                        "Phone number must be at least 10 characters long",
                    },
                    maxLength: {
                      value: 12,
                      message:
                        "Phone number must be at most 12 characters long",
                    },
                  }}
                />
                {errors.phone && (
                  <span className="mt-1 flex items-center gap-x-2 text-sm">
                    <InfoIcon className="h-4 w-4 text-red-800" />
                    {errors.phone.message}
                  </span>
                )}
              </div>
              {/* </div> */}

              <div>
                <Label className="mb-2 block text-sm font-medium text-gray-700">
                  Email
                </Label>
                <Input
                  {...register("email", {
                    required: "Email tidak boleh kosong",
                  })}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="block w-full rounded-md border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                {errors.email && (
                  <span className="mt-1 flex items-center gap-x-2 text-sm">
                    <InfoIcon className="h-4 w-4 text-red-800" />
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div>
                <Label className="mb-2 block text-sm font-medium text-gray-700">
                  Password
                </Label>
                <Input
                  {...register("password", {
                    required: "Password tidak boleh kosong",
                    // onChange: handlePasswordChange,
                  })}
                  id="password"
                  onChange={handlePasswordChange}
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  className="block w-full rounded-md border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              {/* make a list of password minimal condition min 8 and number */}
              <ul className="list-none text-sm text-gray-700">
                {requirements.map((req) => (
                  <li
                    key={req.id}
                    className="flex items-center gap-y-3 space-x-2 align-middle"
                  >
                    {req.isMet ? (
                      <CheckIcon className="h-4 w-4 text-green-800" />
                    ) : (
                      <InfoIcon className="h-4 w-4 text-red-800" />
                    )}
                    <span>{req.text}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-1">
                <button
                  type="submit"
                  // disabled={
                  //   requirements.every((req) => req.isMet === true) === false
                  // }
                  className="w-full rounded-full border border-transparent bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Sign up <span aria-hidden="true">&rarr;</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </AuthLayout>
    </>
  );
};

export default Register;
