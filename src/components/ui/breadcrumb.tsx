import { useRouter } from "next/router";
import { Home } from "lucide-react";
import Link from "next/link";
import React, { useMemo } from "react";

interface BreadcrumbsProps {
  patientName?: string;
  patientId?: string;
  isPatientLast?: boolean;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  patientName,
  patientId,
  isPatientLast,
}) => {
  const router = useRouter();

  const breadcrumbs = useMemo(
    function generateBreadcrumbs() {
      const asPathWithoutQuery = router.asPath.split("?")[0];

      // remove "/path1/path2/path3" => ["path1", "path2", "path3"]
      const asPathNestedRoutes = asPathWithoutQuery?.split("/").filter((p) => {
        return p.length > 0 && !p.includes("dashboard");
      });

      // build crumb object
      const crumbList = asPathNestedRoutes?.map((subpath, i) => {
        let text = subpath;
        if (subpath === "new") {
          text = "pemeriksaan baru";
        } else if (subpath === "checkup") {
          text = "detail pemeriksaan";
        } else if (subpath === "record") {
          text = "catatan medis";
        }
        const href =
          "/dashboard/" + asPathNestedRoutes.slice(0, i + 1).join("/");

        return { href, text };
      });

      // create default path wich is "Home"
      return [
        { href: "/dashboard/home", text: "Home" },
        ...(crumbList as { href: string; text: string }[]),
      ];
    },
    [router.asPath]
  );

  return (
    <nav
      className="flex flex-wrap overflow-x-scroll pb-5 lg:overflow-x-hidden "
      aria-label="breadcrumb"
    >
      <ol
        role="list"
        className="flex space-x-4 rounded-md bg-white pl-2 pr-6 shadow"
      >
        <li className="flex flex-col">
          <div className="flex items-center ">
            {breadcrumbs.map((crumb, i) => (
              <Crumb
                key={i}
                {...crumb}
                last={i === breadcrumbs.length - 1}
                patienName={patientName}
                patientId={patientId}
                isPatientLast={isPatientLast}
              />
            ))}
          </div>
        </li>
      </ol>
    </nav>
  );
};

interface CrumbProps {
  text: string;
  href: string;
  last?: boolean;
  patienName?: string;
  patientId?: string;
  isPatientLast?: boolean;
}

const Crumb: React.FC<CrumbProps> = ({
  text,
  href,
  last = false,
  patienName,
  patientId,
  isPatientLast,
}) => {
  const isRecord = href.includes("record");
  const isCheckup = href.includes("checkup");
  const isPatient = text.includes(patientId as string) ? patienName : text;

  if (last) {
    return (
      <>
        {isPatientLast ? (
          <span className="ml-4 cursor-default text-xs font-medium capitalize text-gray-500 sm:text-sm">
            {patienName}
          </span>
        ) : (
          <span className="ml-4 cursor-default text-xs font-medium capitalize text-gray-500 sm:text-sm">
            {text}
          </span>
        )}
      </>
    );
  }

  return (
    <>
      <Link
        href={href}
        className={`ml-4 text-xs font-medium text-gray-400 hover:text-gray-700 sm:text-sm 
          ${
            isRecord || isCheckup
              ? "pointer-events-none cursor-default text-gray-400"
              : ""
          }`}
      >
        {text === "Home" ? (
          <Home className="h-5 w-5 flex-shrink-0" />
        ) : (
          <span className="capitalize">{isPatient}</span>
        )}
      </Link>
      <svg
        className="h-full w-6 flex-shrink-0 text-gray-200"
        viewBox="0 0 24 44"
        preserveAspectRatio="none"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
      </svg>
    </>
  );
};

export default Breadcrumbs;
