import { LucideIcon } from "lucide-react";

import { cn } from "@/utils/cn";
import { rupiah, persen } from "@/utils/intlformat";

export interface StatsProps {
  header: {
    /// Title of the stats
    title: string;
    icon: LucideIcon;

    /// Tailwind background color for the icon
    bgColor?: string;

    /// Tailwind text color for the header
    color?: string
  };

  stats: {
    /// Value of the statistics
    value: string;

    /// Additional metadata fields explaining the context of the statistic.
    metadata: {
      [k: string]: string;
    };
  };
}

export const Stats = (props: StatsProps) => {
  const bgColor = props.header.bgColor ?? "bg-blue-200"
  const color = props.header.color ?? "text-blue-700";

  return (
    <div className="flex flex-col justify-between h-full rounded-lg bg-white shadow p-6">
      <div
        className={cn("mb-2 flex items-center", color)}
      >
        <props.header.icon className={cn("p-2 h-9 w-9 rounded-full mr-3 text-xl font-bold hidden sm:block", bgColor)} />
        <p className="truncate text-xl font-medium">{props.header.title}</p>
        <p className="ml-auto truncate text-2xl font-semibold">
          {props.stats.value}
        </p>
      </div>
      <div>
        <ul className="mt-auto text-sm text-slate-500">
          {Object.entries(props.stats.metadata).map(([key, value]) => (
            <li>
              <span className="inline-block font-medium">{key}</span>
              <span className="inline-block float-right">{value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
