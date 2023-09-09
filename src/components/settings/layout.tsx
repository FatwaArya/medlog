"use client"

import Image from "next/image"

import React from "react";
import { ChevronsLeft, Menu, type LucideIcon, AlignLeft, ArrowBigLeftIcon, ArrowBigLeft, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { NewLogo } from "../landing/NewLogo";
import { Separator } from "@/components/ui/separator"
import { SidebarNav } from "./sidebar/sidebar"
import { Button, buttonVariants } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { usePathname } from "next/navigation";



const sidebarNavItems = [
    {
        title: "Akun dan Keamanan",
        href: "/settings/user",
    },
    {
        title: "Langganan",
        href: "/settings/subscription",
    },
]

function MobileDialog() {
    const pathname = usePathname()


    return (
        <Dialog>
            <DialogTrigger asChild className=" border-gray-200  text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden">
                <Menu className="h-8 w-8" aria-hidden="true" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <Link href="/dashboard/home">
                        <div className="flex space-x-2 text-base font-medium ">
                            <ArrowLeft />
                            <span>Kembali</span>
                        </div>
                    </Link>
                </DialogHeader>
                <Separator />
                <nav className="my-2">
                    {sidebarNavItems
                        .map((item) => (
                            <Link
                                key={item.title}
                                href={item.href}
                                className={cn(
                                    buttonVariants({ variant: "ghost" }),
                                    pathname === item.href || pathname.startsWith(item.href)
                                        ? "bg-muted hover:bg-muted"
                                        : "hover:bg-transparent hover:underline",
                                    "grid grid-cols-2 gap-2 text-base font-medium"
                                )}
                            >
                                {item.title}
                            </Link>
                        ))}
                </nav>

            </DialogContent>
        </Dialog >
    )
}

interface SettingsLayoutProps {
    children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
    return (
        <>
            {/* <SidebarMobileNav items={sidebarNavItems} open={open} setOpen={setOpen} /> */}

            <div className="space-y-6 p-10 pb-16 md:block">

                <div className="space-y-0.5 flex items-center gap-4">
                    <MobileDialog />
                    <Link href={'/dashboard/home'}
                        className="hidden md:flex items-center"
                    >
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
                    <aside
                        className="-mx-4 lg:w-1/5 hidden lg:block"
                    >
                        <SidebarNav items={sidebarNavItems} />
                    </aside>
                    <div className="flex-1 lg:max-w-4xl">{children}</div>
                </div>
            </div>
        </>
    )
}