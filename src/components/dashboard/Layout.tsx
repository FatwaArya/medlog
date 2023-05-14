/* This example requires Tailwind CSS v2.0+ */
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { type PropsWithChildren, useEffect, useState } from "react";

import { Sidebar } from "@/components/dashboard/Sidebar";

import {
  HomeIcon,
  UsersIcon,
  DownloadIcon,
  ShieldIcon,
} from "lucide-react";

import { Navbar } from "./Navbar";
import ContentArea from "./ContentArea";

export function AdminLayout(props: PropsWithChildren) {
  const { data, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [navigation, setNavigation] = useState([
    {
      name: "Beranda",
      href: "/dashboard/home",
      icon: HomeIcon,
      current: false,
      isAdmin: false

    },
    {
      name: "Data Pasien",
      href: "/dashboard/patients",
      icon: UsersIcon,
      current: false,
      isAdmin: false

    },
    {
      name: "Laporan",
      href: "/dashboard/report",
      icon: DownloadIcon,
      current: false,
      isAdmin: false

    },
    {
      name: "Atur Pengguna",
      href: "/dashboard/admin",
      icon: ShieldIcon,
      current: false,
      isAdmin: data?.user.role === "admin" ? false : true
    }
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

  }, [pathname, data?.user.role]);

  if (status === "loading") {
    return <div>Loading user info...</div>;
  }
  console.log(navigation)
  return (
    <>
      <Sidebar
        entries={navigation.filter((nav) => nav.isAdmin === false)}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />
      <Navbar setSidebarOpen={setSidebarOpen} />
      <ContentArea {...props} />
    </>
  );
}

export default AdminLayout;
