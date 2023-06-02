/* This example requires Tailwind CSS v2.0+ */
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { type PropsWithChildren, useEffect, useState } from "react";

import Sidebar from "@/components/dashboard/Sidebar";

import { Home, Users, Download, Shield } from "lucide-react";

import Navbar from "./Navbar";
import ContentArea from "./ContentArea";

const AdminLayout = (props: PropsWithChildren) => {
  const { data, status } = useSession();
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
      name: "Atur Pengguna",
      href: "/dashboard/accounts-management",
      icon: Shield,
      current: false,
      hide: data?.user.role !== "admin",
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
  console.log(data);
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
