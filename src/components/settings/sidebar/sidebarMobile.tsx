
"use client"

import Image from "next/image"

import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ChevronsLeft, type LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { Separator } from "@/components/ui/separator"

import { usePathname } from "next/navigation";


interface SidebarMobileNavProps extends React.HTMLAttributes<HTMLElement> {
    items: {
        href: string
        title: string
    }[]
    open: boolean
    setOpen: (open: boolean) => void
}

export function SidebarMobileNav({ className, items, open, setOpen, ...props }: SidebarMobileNavProps) {
    const pathname = usePathname()

    return (
        <nav {...props} className={className}>
            <Dialog.Root open={open} onOpenChange={setOpen} >
                <AnimatePresence>
                    {open ? (
                        <Dialog.Portal forceMount>
                            <Dialog.Overlay
                                forceMount
                                asChild
                            >
                                <motion.div
                                    className="fixed inset-0 cursor-pointer bg-black/50 backdrop-blur-[10px]"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.7 }}
                                    exit={{ opacity: 0 }}
                                ></motion.div>
                            </Dialog.Overlay>
                            <Dialog.Content
                                className="fixed left-0 top-0 flex h-full w-full max-w-xs flex-col border-r border-l-gray-500 bg-white"
                                forceMount
                                asChild
                            >
                                <motion.div
                                    className="h-0 flex-1 overflow-y-auto pb-4 pt-5"
                                    initial={{ left: "-100%" }}
                                    animate={{ left: 0 }}
                                    exit={{ left: "-100%" }}
                                >
                                    <div className="flex items-center px-4">
                                        <Dialog.Close asChild>
                                            <button
                                                className="ml-auto text-slate-700"
                                                aria-label="close"
                                            >
                                                <ChevronsLeft />
                                            </button>
                                        </Dialog.Close>
                                    </div>
                                    <nav className="mt-8 space-y-2">
                                        {items
                                            .map((item) => (
                                                <Link
                                                    key={item.title}
                                                    href={item.href}
                                                    className={cn(
                                                        pathname === item.href || pathname.startsWith(item.href)
                                                            ? "bg-blue-200/50 text-blue-600 before:absolute before:left-0 before:h-full before:w-1 before:rounded-md before:bg-gradient-to-b before:from-blue-600 before:to-blue-200 before:content-['']"
                                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                                                        "group relative flex items-center px-7 py-3 text-base font-medium"
                                                    )}
                                                >
                                                    {item.title}
                                                </Link>
                                            ))}
                                    </nav>
                                </motion.div>
                            </Dialog.Content>
                        </Dialog.Portal>
                    ) : null}
                </AnimatePresence>
            </Dialog.Root>
        </nav>
    )
}