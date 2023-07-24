import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ChevronsLeft, type LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { NewLogo } from "../landing/NewLogo";


interface SidebarEntry {
  name: string;
  href: string;
  icon: LucideIcon;
  current: boolean;
}

interface SidebarProps {
  entries: SidebarEntry[];
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function Sidebar({ entries, open, setOpen }: SidebarProps) {
  return (
    <>
      <Dialog.Root open={open} onOpenChange={setOpen}>
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
                    <NewLogo />
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
                    {entries.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          item.current
                            ? "bg-blue-200/50 text-blue-600 before:absolute before:left-0 before:h-full before:w-1 before:rounded-md before:bg-gradient-to-b before:from-blue-600 before:to-blue-200 before:content-['']"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                          "group relative flex items-center px-7 py-3 text-base font-medium"
                        )}
                      >
                        <item.icon
                          className={cn(
                            item.current
                              ? "text-blue-600"
                              : "text-gray-400 group-hover:text-gray-500",
                            "mr-4 h-6 w-6 flex-shrink-0"
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          ) : null}
        </AnimatePresence>
      </Dialog.Root>

      {/* Static Sidebar for desktop */}
      <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        {/* Sidebar component, swap this element with another Sidebar if you like */}
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          <div className="flex flex-1 flex-col overflow-y-auto pb-4 pt-5">
            <div className="flex flex-shrink-0 items-center px-7">
              <NewLogo />
            </div>
            <nav className="mt-8 flex-1 space-y-2 bg-white">
              {entries.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    item.current
                      ? "bg-blue-200/50 text-blue-600 before:absolute before:left-0 before:h-full before:w-1 before:rounded-md before:bg-gradient-to-b before:from-blue-600 before:to-blue-200 before:content-['']"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    "group relative flex items-center px-7 py-3 text-sm font-medium"
                  )}
                >
                  <item.icon
                    className={cn(
                      item.current
                        ? "text-blue-600"
                        : "text-gray-400 group-hover:text-gray-500",
                      "mr-3 h-6 w-6 flex-shrink-0"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
}
