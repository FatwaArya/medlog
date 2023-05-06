import { useRouter } from "next/router";
import { HomeIcon } from "lucide-react";
import React, { useMemo } from "react";

interface BreadcrumbsProps {
  patientName?: string;
  patientId?: string;
}

const Breadcrumbs : React.FC<BreadcrumbsProps> = ({patientName, patientId}) => {
  const router = useRouter();

  const breadcrumbs = useMemo((
    function generateBreadcrumbs() {
      const asPathWithoutQuery = router.asPath.split("?")[0];

      // remove "/path1/path2/path3" => ["path1", "path2", "path3"]
      const asPathNestedRoutes = asPathWithoutQuery?.split("/").filter(p => {

        return p.length > 0 && !p.includes("dashboard");
      });
  
      // build crumb object
      const crumbList = asPathNestedRoutes?.map((subpath, i) => {
        const href = "/dashboard/" + asPathNestedRoutes.slice(0, i + 1).join("/");
        const text = subpath;
        console.log(text);
        
        return {href, text};
      })

      // create default path wich is "Home"
      return [{href: "/dashboard/home", text: "Home"}, ...crumbList];
    }
  ), [router.asPath])

  return (
    <nav className="flex flex-wrap pb-5" aria-label="breadcrumb">
      <ol role="list" className="bg-white rounded-md shadow pr-6 pl-2 flex space-x-4">
        <li className="flex flex-col">
          <div className="flex items-center">
            {breadcrumbs.map((crumb, i) => (
              <Crumb key={i} {...crumb} last={i === breadcrumbs.length - 1} patienName={patientName} patientId={patientId} />
            ))}
          </div>
        </li>
      </ol>
    </nav>
  )
}

interface CrumbProps {
  text: string;
  href: string;
  last?: boolean;
  patienName?: string;
  patientId?: string;
}

const Crumb : React.FC<CrumbProps> = ({ text, href, last=false, patienName, patientId}) => {

  const isRecord = href.includes("record");
  const isCheckup = href.includes("checkup");
  const isPatient = text.includes(patientId as string) ? patienName : text;

  if(last) {
    return (
      <>
      {isPatient ? (
        <span className="ml-4 text-sm font-medium text-gray-500 capitalize cursor-default">
            {text.includes("new") ? "Pemeriksaan Baru" : patienName ? patienName : text}
        </span>
      ) : (
        <span className="ml-4 text-sm font-medium text-gray-500 capitalize cursor-default">
            {patienName}
        </span>
      )}
      </>
    )
  }

  return (
    <>
        <a href={href} className={`ml-4 text-sm font-medium text-gray-400 hover:text-gray-700 
          ${isRecord || isCheckup ? "cursor-default pointer-events-none text-gray-400" : ""}`}
        >
          {
            text === "Home" ? <HomeIcon className="flex-shrink-0 h-5 w-5" /> : 
            <span className="capitalize">
              {isRecord ? "Catatan Medis" : isPatient}
            </span>
        }
      </a>
      <svg
        className="flex-shrink-0 w-6 h-full text-gray-200"
        viewBox="0 0 24 44"
        preserveAspectRatio="none"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
      </svg>
    </>

  )
}

export default Breadcrumbs;