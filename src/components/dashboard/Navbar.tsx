import { cn } from "@/utils/cn";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { signOut, useSession } from "next-auth/react";
import {
  LogOut,
  Menu,
  Settings,
  User,
  Calculator,
  Calendar,
  CreditCard,
  Smile,

} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { Loader } from "../auth/AuthGuard";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { DialogProps } from "@radix-ui/react-dialog";
import { useRouter } from "next/router";


const userNavigation = [
  { name: "Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Logout", href: "/", icon: LogOut },
];

export default function Navbar({
  setSidebarOpen,
}: {
  setSidebarOpen: (isOpen: boolean) => void;
}) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <Loader />;
  }

  return (
    <header className="flex flex-1 flex-col md:pl-64">
      <div className="sticky top-0 flex h-16 flex-shrink-0 bg-white shadow">
        <button
          type="button"
          className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
        <div className="flex flex-1 justify-between px-4">
          <div className="flex flex-1">
            <div className="flex w-full md:ml-0 items-center" >
              <CommandDialogPasienPlus />
            </div>
          </div>
          <div className="ml-4 flex items-center md:ml-6">
            <button
              type="button"
              className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span className="sr-only">View notifications</span>
              {/* <BellIcon className="h-6 w-6" aria-hidden="true" /> */}
            </button>

            {/* Profile dropdown */}

            <DropdownMenu>
              <div className="relative ml-3">
                <DropdownMenuTrigger
                  className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  asChild
                >
                  <div>
                    <span className="sr-only">Open user menu</span>
                    <Avatar>
                      <AvatarImage src={session?.user.image as string} className="h-8 w-8 rounded-full" />
                      <AvatarFallback>{
                        session?.user.name?.split(" ").map((name) => name[0]).join("")
                      }</AvatarFallback>
                    </Avatar>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <DropdownMenuLabel>{session?.user.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {userNavigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          "block  text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        )}
                        onClick={() => {
                          if (item.name === "Logout") {
                            signOut({ callbackUrl: "/" })
                          }
                        }}
                      >
                        <DropdownMenuItem key={item.name}>

                          <item.icon className="mr-2 h-4 w-4" />
                          <span>{item.name}</span>

                        </DropdownMenuItem>  </Link>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </div>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}

export function CommandDialogPasienPlus({ ...props }: DialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "relative h-9  justify-start rounded-[0.5rem] text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        )}
        onClick={() => setOpen(true)}
        {...props}
      >
        <span className="hidden lg:inline-flex">
          Tambah Pasien atau lihat data pasien disini
        </span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">
            <span className="hidden sm:inline">Ctrl+</span>
          </span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Cari pasien atau tambah pasien..." className="outline-red-700" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>
              <Calendar className="mr-2 h-4 w-4" />
              <span>Calendar</span>
            </CommandItem>
            <CommandItem>
              <Smile className="mr-2 h-4 w-4" />
              <span>Search Emoji</span>
            </CommandItem>
            <CommandItem>
              <Calculator className="mr-2 h-4 w-4" />
              <span>Calculator</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}