import * as React from "react";

import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/utils/cn";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSession } from "next-auth/react";
import { type GetServerSidePropsContext } from "next/types";
import { getServerAuthSession } from "@/server/auth";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { Loader } from "@/components/auth/AuthGuard";
import { PatternFormat } from "react-number-format";
import { id } from "date-fns/locale";
import { RouterInputs, api } from "@/utils/api";
import { useRouter } from "next/router";
import Head from "next/head";
import toast from "react-hot-toast";

type OnBoard = RouterInputs["user"]["boarding"];

export default function Onboarding() {
  const { data, status } = useSession();
  const boarding = api.user.boarding.useMutation();
  const router = useRouter();

  const form = useForm<OnBoard>();

  const onSubmit: SubmitHandler<OnBoard> = async (values) => {
    boarding.mutate(
      {
        phone: values.phone,
      },
      {
        onSuccess: () => {
          router.push("/dashboard/home");
        },
        onError: (e) => {
          const errorMessage = e.data?.zodError?.fieldErrors.phone;
          if (errorMessage && errorMessage[0]) {
            toast.error(errorMessage[0]);
          } else {
            toast.error(e.message);
          }
        },
      }
    );
  };

  if (status === "loading") {
    return <Loader />;
  }

  return (
    <>
      <Head>
        <title>Onboarding | {data?.user.name}</title>
      </Head>
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card className=" w-[350px]">
              <CardHeader>
                <CardTitle>Hallo, {data?.user.name}! </CardTitle>
                <CardDescription>
                  Ayo isi nomor telpon kamu untuk memulai.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <FormLabel htmlFor="name">Nomor Telpon</FormLabel>
                    <FormField
                      name="phone"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormControl>
                            <PatternFormat
                              format="####-####-####"
                              customInput={Input}
                              onValueChange={(values) => {
                                field.onChange(values.value);
                              }}
                              className="block w-full rounded-md border-gray-300 bg-white  pr-12 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              name={field.name}
                              value={field.value}
                              onBlur={field.onBlur}
                              getInputRef={field.ref}
                              autoComplete="phone"
                              id="phone-number"
                              placeholder="08XX-XXXX-XXXX"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                      rules={{
                        required: true,
                        minLength: 10,
                        maxLength: 12,
                      }}
                    />{" "}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  className={cn(
                    "bg-blue-500 text-white hover:bg-blue-600  ",
                    boarding.isLoading &&
                      "bg-blue-600 hover:bg-blue-500 hover:text-slate-100 focus-visible:outline-blue-600 active:bg-blue-800 active:text-blue-100"
                  )}
                  disabled={boarding.isLoading}
                >
                  {
                    //loader animate
                    boarding.isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )
                  }
                  Lanjut
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerAuthSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  //if user is not new, redirect to dashboard
  if (!session.user.isNewUser) {
    return {
      redirect: {
        destination: "/dashboard/home",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}
