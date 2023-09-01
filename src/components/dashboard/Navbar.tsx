/* eslint-disable @typescript-eslint/ban-ts-comment */
import { cn } from "@/utils/cn";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  LogOut,
  Menu,
  Settings,
  User,
  Calculator,
  Calendar,
  CreditCard,
  Smile,
  UserPlus,
  Users,
  Megaphone,
  BellIcon,

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
  CommandLoading,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { Loader } from "../auth/AuthGuard";
import { use, useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { type DialogProps } from "@radix-ui/react-dialog";
import { useRouter } from "next/router";
import { RouterOutputs, api } from "@/utils/api";
import { run } from "node:test";
import { useDebounce } from "@/hooks/use-debounce";
import { useCommandState } from "cmdk";
import Script from "next/script";
import { env } from "@/env.mjs";
import { UserButton, useClerk, useUser } from "@clerk/nextjs";




const userNavigation = [
  { name: "Profile", href: "/settings/user", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Logout", href: "/", icon: LogOut },
];

export default function Navbar({
  setSidebarOpen,
}: {
  setSidebarOpen: (isOpen: boolean) => void;
}) {
  const { isSignedIn, user, isLoaded } = useUser();
  const { signOut } = useClerk();

  const { data: ssoToken } = api.canny.cannyUserToken.useQuery();
  useEffect(() => {

    (function (w, d, i, s) {
      // @ts-ignore
      function l() {
        // @ts-ignore
        if (!d.getElementById(i)) {
          // @ts-ignore
          const f = d.getElementsByTagName(s)[0],
            e = d.createElement(s);
          // @ts-ignore
          e.type = "text/javascript";
          // @ts-ignore
          e.async = !0;
          // @ts-ignore
          e.src = "https://canny.io/sdk.js";
          // @ts-ignore
          f.parentNode.insertBefore(e, f);
        }
      }
      // @ts-ignore
      if ("function" != typeof w.Canny) {
        // @ts-ignore
        const c = function () {
          // @ts-ignore
          // eslint-disable-next-line prefer-rest-params
          c.q.push(arguments);
        };
        // @ts-ignore
        c.q = [];
        // @ts-ignore
        w.Canny = c;
        // @ts-ignore
        "complete" === d.readyState
          ? l()
          // @ts-ignore
          : w.attachEvent
            // @ts-ignore
            ? w.attachEvent("onload", l)
            : w.addEventListener("load", l, !1);
      }
    })(window, document, "canny-jssdk", "script");

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    Canny('initChangelog', {
      appID: env.NEXT_PUBLIC_APPID,
      ssoToken,
      position: 'bottom',
      align: 'right',
      theme: 'light', // options: light [default], dark, auto
    });

    return () => {
      // @ts-ignore
      Canny('closeChangelog');
    }

  }, [ssoToken])

  if (!isLoaded) {
    return <Loader />;
  }

  return (
    <>
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
              <div className="relative w-full">
                <div className="flex justify-center">
                  <CommandDialogPasienPlus />
                </div>
              </div>
            </div>

            <div className=" flex items-center ">
              <button
                className="mx-6"
                data-canny-changelog
                //change megaphone color when hover
                onMouseEnter={(e) => {
                  e.currentTarget.classList.add("text-blue-600")
                }
                }
                onMouseLeave={(e) => {
                  e.currentTarget.classList.remove("text-blue-600")
                }
                }
              >
                <span className="sr-only">View notifications</span>
                <Megaphone className="h-6 w-6" aria-hidden="true" />
              </button>
              {/* Profile dropdown */}
              {/* <UserButton afterSignOutUrl="/" /> */}
              <DropdownMenu>
                <div className="relative ml-3">
                  <DropdownMenuTrigger
                    className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    asChild
                  >
                    <div>
                      <span className="sr-only">Open user menu</span>
                      <Avatar>
                        <AvatarImage src={user?.imageUrl} className="h-8 w-8 rounded-full" />
                        <AvatarFallback>{
                          user?.fullName
                        }</AvatarFallback>
                      </Avatar>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <DropdownMenuLabel>{user?.firstName}</DropdownMenuLabel>
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
                              void signOut();
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
    </>
  );
}


function CommandDialogPasienPlus({ ...props }: DialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 800)
  const { data: patientData, isLoading } = api.patient.getNewestPatients.useQuery({ limit: 5, isLastVisit: false });
  const { data: searchPatientData, isLoading: isSearching } = api.patient.searchPatient.useQuery({ query: debouncedSearch })
  console.log(isSearching)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && e.metaKey) {
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])


  return (
    <>
      <Button
        variant="outline"
        className={cn(
          // "relative  justify-start rounded-[0.5rem] text-sm text-muted-foreground sm:pr-4 md:w-4 0 lg:w-64 h-12 w-full"
          "h-12 w-full justify-start rounded-[0.5rem] text-sm text-muted-foreground mt-2 relative"
        )}
        onClick={() => setOpen(true)}
        {...props}
      >
        <span className="hidden lg:inline-flex">
          Cari pasien atau tambah pasien...
        </span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-8 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">
            <span className="hidden sm:inline">Ctrl+</span>
          </span>
          K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Cari pasien atau tambah pasien..." onValueChange={(value) => { setSearch(value) }} value={search} />
        <CommandList>
          {/* wait searching if searchPatientData return empty array the show no re */}
          {isSearching
            ? <CommandLoading>Mencari Pasien... </CommandLoading>
            : searchPatientData?.length === 0 && <CommandEmpty>Tidak ada pasien yang ditemukan</CommandEmpty>
          }

          <CommandGroup heading="Suggestions">
            <CommandItem className="cursor-pointer" onSelect={() => {
              runCommand(() => router.push("/dashboard/patients/checkup/new"))
            }}>
              <UserPlus className="mr-2 h-4 w-4" />
              <span>Tambah Pasien</span>
            </CommandItem>
            <CommandItem onSelect={() => {
              runCommand(() => router.push("/dashboard/patients"))
            }}
              className="cursor-pointer"
            >
              <Users className="mr-2 h-4 w-4" />
              <span>Lihat semua pasien</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Daftar Pasien">
            {
              patientData?.map(({ patient }) => (
                <CommandItem
                  onSelect={() => {
                    runCommand(() => router.push(`/dashboard/patients/record/${patient.id}`))
                  }}
                  value={patient.name}
                  key={patient.id}>
                  <User className="mr-2 h-4 w-4" />
                  <span>{patient.name}</span>
                </CommandItem>
              ))
            }
            {
              searchPatientData && searchPatientData.map((patient) => (
                <CommandItem
                  onSelect={() => {
                    runCommand(() => router.push(`/dashboard/patients/record/${patient.id}`))
                  }}
                  value={patient.name}
                  key={patient.id}>
                  <User className="mr-2 h-4 w-4" />
                  <span>{patient.name}</span>
                </CommandItem>
              ))
            }
          </CommandGroup>
          <CommandSeparator />
        </CommandList>
      </CommandDialog>
    </>
  )
}