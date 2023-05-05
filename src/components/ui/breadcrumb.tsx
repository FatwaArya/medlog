import { useRouter } from "next/router";
import { HomeIcon } from "lucide-react";
import { useMemo } from "react";

export default function Breadcrumbs() {
  const router = useRouter();

  const breadcrumbs = useMemo((
    function generateBreadcrumbs() {
      const asPathWithoutQuery = router.asPath.split("?")[0];

      // remove "/path1/path2/path3" => ["path1", "path2", "path3"]
      const asPathNestedRoutes = asPathWithoutQuery?.split("/").filter(p => p.length > 0);

      // build crumb object
      const crumbList = asPathNestedRoutes?.map((subpath, i) => {
        const href = "/" + asPathNestedRoutes.slice(0, i + 1).join("/");
        const text = subpath;

        return { href, text };
      })

      // create default path wich is "Home"
      return [{ href: "/", text: "Home" }, ...crumbList as { href: string, text: string }[]];
    }
  ), [router.asPath])

  return (
    <nav className="flex flex-wrap pb-5" aria-label="breadcrumb">
      <ol role="list" className="bg-white rounded-md shadow pr-6 pl-2 flex space-x-4">
        <li className="flex flex-col">
          <div className="flex items-center">
            {breadcrumbs.map((crumb, i) => (
              <Crumb key={i} {...crumb} last={i === breadcrumbs.length - 1} />
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
}

const Crumb: React.FC<CrumbProps> = ({ text, href, last = false }) => {

  if (last) {
    return (
      <>
        <span className="ml-4 text-sm font-medium text-gray-500 capitalize">{text}</span>
      </>
    )
  }

  return (
    <>
      <a href={href} className="ml-4 text-sm font-medium text-gray-400 hover:text-gray-700">
        {
          text === "Home" ? <HomeIcon className="flex-shrink-0 h-5 w-5" /> :
            <span className="capitalize">
              {text}
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