"use client"

import Image from "next/image"

import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ChevronsLeft, Menu, type LucideIcon, AlignLeft, ArrowBigLeftIcon, ArrowBigLeft, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { NewLogo } from "../landing/NewLogo";
import { Separator } from "@/components/ui/separator"
import { SidebarNav } from "./sidebar/sidebar"
import { usePathname } from "next/navigation";
import { SidebarMobileNav } from "./sidebar/sidebarMobile";


const sidebarNavItems = [

    {
        title: "Akun dan Keamanan",
        href: "/settings/user",
    },
    {
        title: "Langganan",
        href: "/settings/subscription",
    },
    {
        title: "Notifications",
        href: "/examples/forms/notifications",
    },
    {
        title: "Display",
        href: "/examples/forms/display",
    },
]

interface SettingsLayoutProps {
    children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
    const [open, setOpen] = React.useState(false)

    return (
        <>
            <SidebarMobileNav items={sidebarNavItems} open={open} setOpen={setOpen} />

            <div className="space-y-6 p-10 pb-16 md:block">

                <div className="space-y-0.5 flex items-center gap-4">
                    <button
                        type="button"
                        className=" border-gray-200 pr-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
                        onClick={() => setOpen(true)}
                    >
                        <span className="sr-only">Open sidebar</span>
                        <Menu className="h-6 w-6" aria-hidden="true" />
                    </button>
                    <Link href={'/dashboard/home'}>
                        <ArrowLeft />
                    </Link>

                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
                        <p className="text-muted-foreground">
                            Kelola akun dan pengaturan Anda
                        </p>
                    </div>

                </div>
                <Separator className="my-6" />
                <div className="flex flex-col space-y-6 lg:flex-row lg:space-x-12 lg:space-y-0">
                    <aside className="xs:hidden -mx-4 lg:w-1/5">
                        <SidebarNav items={sidebarNavItems} />
                    </aside>
                    <div className="flex-1 lg:max-w-2xl">{children}</div>
                </div>
            </div>
        </>
    )
}