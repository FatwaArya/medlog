import { LucideIcon } from "lucide-react";

import { cn } from "@/utils/cn";
import { rupiah, persen } from "@/utils/intlformat";

export interface StatsProps {
  header: {
    /// Title of the stats
    title: string;
    icon: LucideIcon;

    /// Tailwind color
    twColor?: string
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
  return (
    <div className="flex flex-col justify-between h-full rounded-lg bg-white shadow p-6">
      <div
        className={`mb-2 flex items-center text-${props.header.twColor ?? "blue"}-700`}
      >
        <props.header.icon className={`p-2 h-9 w-9 bg-${props.header.twColor ?? "blue"}-200 rounded-full mr-2 text-xl font-bold`} />
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
