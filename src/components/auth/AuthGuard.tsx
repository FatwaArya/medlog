import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface IAuthGuardProps {
  children: React.ReactNode;
  isSubscription?: boolean;
}

export function Loader() {
  return (
    <div className="flex h-screen items-center justify-center">
      <svg
        className="-ml-1 mr-3 h-8 w-8 animate-spin text-indigo-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  );
}

const AuthGuard: React.FC<IAuthGuardProps> = ({ children, isSubscription = true }) => {
  const { data, status: sessionStatus } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      void router.push("/auth/signin");
    }
    if (data?.user?.isSubscribed === false && isSubscription === false || sessionStatus === "authenticated") {
      void router.push("/subscription");
    }
  }, [data?.user?.isSubscribed, isSubscription, sessionStatus]);

  if (["loading", "unauthenticated"].includes(sessionStatus) || (isSubscription && data?.user?.isSubscribed === false)) {
    return <Loader />;
  }


  return <>{children}</>;
};

export default AuthGuard;
