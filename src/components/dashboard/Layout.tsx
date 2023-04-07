/* This example requires Tailwind CSS v2.0+ */
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { PropsWithChildren, useEffect, useState } from "react";

import { Sidebar } from "@/components/dashboard/Sidebar";

import {
  HomeIcon,
  UsersIcon,
  ShoppingCartIcon,
  FilePlusIcon,
  DownloadIcon,
  Activity,
} from "lucide-react";
import { Navbar } from "./Navbar";
import ContentArea from "./ContentArea";

export function AdminLayout(props: PropsWithChildren) {
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [navigation, setNavigation] = useState([
    {
      name: "Dashboard",
      href: "/dashboard/home",
      icon: HomeIcon,
      current: false,
    },
    {
      name: "Checkup",
      href: "/dashboard/checkup",
      icon: Activity,
      current: false,
    },
    {
      name: "Patient List",
      href: "/dashboard/patients",
      icon: UsersIcon,
      current: false,
    },
    {
      name: "Transaction",
      href: "/dashboard/transactions",
      icon: FilePlusIcon,
      current: false,
    },
    {
      name: "Report",
      href: "/dashboard/report",
      icon: DownloadIcon,
      current: false,
    },
  ]);

  const { pathname } = useRouter();

  useEffect(() => {
    if (pathname) {
      const newNavigation = navigation.map((nav) => {
        console.log(nav.href);
        return {
          ...nav,
          current: pathname === nav.href || pathname.startsWith(nav.href),
        };
      });
      setNavigation(newNavigation);
    }

  }, [pathname]);

  if (status === "loading") {
    return <div>Loading user info...</div>;
  }

  return (
    <>
      <Sidebar
        entries={navigation}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />
      <Navbar setSidebarOpen={setSidebarOpen} />
      <ContentArea {...props} />
    </>
  );
}

export default AdminLayout;
