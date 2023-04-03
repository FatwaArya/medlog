import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ChevronsLeft, type LucideIcon } from "lucide-react";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

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

export function Sidebar({ entries, open, setOpen }: SidebarProps) {
  return (
    <div>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0 bg-gray-500/5" />
          <Dialog.Content className="fixed left-0 top-0 flex h-full w-full max-w-xs flex-col border-r border-l-gray-500 bg-white px-4">
            <div className="h-0 flex-1 overflow-y-auto pb-4 pt-5">
              <div className="flex items-center">
                <img
                  className="h-8 w-auto"
                  src="https://tailwindui.com/img/logos/workflow-logo-indigo-600-mark-gray-800-text.svg"
                  alt="Workflow"
                />
                <Dialog.Close asChild>
                  <button className="ml-auto text-slate-700" aria-label="close">
                    <ChevronsLeft />
                  </button>
                </Dialog.Close>
              </div>
              <nav className="mt-5 space-y-2">
                {entries.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      item.current
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                      "group flex items-center rounded-md px-2 py-2 text-base font-medium"
                    )}
                  >
                    <item.icon
                      className={classNames(
                        item.current
                          ? "text-gray-500"
                          : "text-gray-400 group-hover:text-gray-500",
                        "mr-4 h-6 w-6 flex-shrink-0"
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </a>
                ))}
              </nav>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Static Sidebar for desktop */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        {/* Sidebar component, swap this element with another Sidebar if you like */}
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          <div className="flex flex-1 flex-col overflow-y-auto pb-4 pt-5">
            <div className="flex flex-shrink-0 items-center px-7">
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/workflow-logo-indigo-600-mark-gray-800-text.svg"
                alt="Workflow"
              />
            </div>
            <nav className="mt-8 flex-1 space-y-2 bg-white">
              {entries.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-blue-200/50 text-blue-600 before:absolute before:left-0 before:h-full before:w-1 before:rounded-md before:bg-gradient-to-b before:from-blue-600 before:to-blue-200 before:content-['']"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    "group relative flex items-center px-7 py-3 text-sm font-medium"
                  )}
                >
                  <item.icon
                    className={classNames(
                      item.current
                        ? "text-blue-600"
                        : "text-gray-400 group-hover:text-gray-500",
                      "mr-3 h-6 w-6 flex-shrink-0"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
