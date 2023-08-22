/* This example requires Tailwind CSS v2.0+ */
import { useRouter } from "next/router";
import { type PropsWithChildren, useEffect, useState } from "react";

import Sidebar from "@/components/dashboard/Sidebar";

import { Home, Users, Download, Shield, MessageSquarePlus } from "lucide-react";

import Navbar from "./Navbar";
import ContentArea from "./ContentArea";
import { useUser } from "@clerk/nextjs";

const AdminLayout = (props: PropsWithChildren) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [navigation, setNavigation] = useState([
    {
      name: "Beranda",
      href: "/dashboard/home",
      icon: Home,
      current: false,
      hide: false,
    },
    {
      name: "Data Pasien",
      href: "/dashboard/patients",
      icon: Users,
      current: false,
      hide: false,
    },
    {
      name: "Laporan",
      href: "/dashboard/report",
      icon: Download,
      current: false,
      hide: false,
    },
    {
      name: "Kritik & Saran",
      href: "/dashboard/feedback",
      icon: MessageSquarePlus,
      current: false,
      hide: false,
    },
    // {
    //   name: "Atur Pengguna",
    //   href: "/dashboard/accounts-management",
    //   icon: Shield,
    //   current: false,
    //   hide: user?.publicMetadata
    // },
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

  return (
    <>
      {/* layout problem */}
      <Sidebar
        //filter navigation based on user role
        entries={navigation.filter((nav) => !nav.hide)}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />
      <Navbar setSidebarOpen={setSidebarOpen} />
      <ContentArea {...props} />
    </>
  );
};

export default AdminLayout;
