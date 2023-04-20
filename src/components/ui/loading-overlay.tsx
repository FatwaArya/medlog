import { cn } from "@/utils/cn";
import type { PropsWithChildren } from "react";

export function Spinner(props: { className?: string }) {
  return (
    <svg
      className={cn("h-8 w-8 animate-spin text-indigo-500", props.className)}
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
  );
}

// NOTE: `rounded-lg` has to be adapted for each round size,
//       which currently is impractical
export function LoadingOverlay(props: PropsWithChildren) {
  return (
    <div className="relative w-full h-full rounded-lg overflow-auto">
      <div className="absolute w-full h-full flex justify-center items-center bg-white/30">
        <Spinner />
      </div>
      {props.children}
    </div>
  );
}