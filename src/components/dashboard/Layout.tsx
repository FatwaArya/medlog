/* This example requires Tailwind CSS v2.0+ */
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { type PropsWithChildren, useEffect, useState } from "react";

import { Sidebar } from "@/components/dashboard/Sidebar";

import {
  HomeIcon,
  UsersIcon,
  DownloadIcon,
} from "lucide-react";

import { Navbar } from "./Navbar";
import ContentArea from "./ContentArea";

export function Layout(props: PropsWithChildren) {
  const { status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [navigation, setNavigation] = useState([
    {
      name: "Beranda",
      href: "/dashboard/home",
      icon: HomeIcon,
      current: false,
    },
    {
      name: "Data Pasien",
      href: "/dashboard/patients",
      icon: UsersIcon,
      current: false,
    },
    {
      name: "Laporan",
      href: "/dashboard/report",
      icon: DownloadIcon,
      current: false,
    },
  ]);

  const { pathname } = useRouter();

  useEffect(() => {
    if (pathname) {
      const newNavigation = navigation.map((nav) => {
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

export default Layout;
