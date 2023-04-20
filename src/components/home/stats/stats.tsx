import { type LucideIcon } from "lucide-react";

import { cn } from "@/utils/cn";

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
    <div className="flex flex-col h-full rounded-lg bg-white shadow p-6 outline outline-1 outline-slate-200">
      <div
        className={cn("flex items-center", color)}
      >
        <props.header.icon className={cn("p-2 mr-4 h-9 w-9 rounded-full text-xl font-bold", bgColor)} />
        <p className="leading-6  scroll-m-20 text-xl font-semibold tracking-tight ">{props.header.title}</p>
      </div>
      <div className="flex justify-end items-center grow">
        <p className={cn("text-center text-3xl font-bold mb-2 py-3", color)}>
          {props.stats.value}
        </p>
      </div>
      <div>
        <ul className="text-sm text-slate-500">
          {Object.entries(props.stats.metadata).map(([key, value]) => (
            <li key={key}>
              <span className="inline-block font-medium">{key}</span>
              <span className="inline-block float-right">{value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
