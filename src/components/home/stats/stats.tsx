import { type LucideIcon, EyeIcon, EyeOffIcon } from "lucide-react";


import { cn } from "@/utils/cn";
import { useState } from "react";

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
  const [isHide, setIsHide] = useState(true);
  const bgColor = props.header.bgColor ?? "bg-blue-200"
  const color = props.header.color ?? "text-blue-700";

  const toggle = () => {
    setIsHide(!isHide);
  };


  return (
    <div className={cn("flex flex-col h-full rounded-lg bg-white shadow p-6 outline outline-1 outline-slate-200")}>
      <div className={cn("flex items-center", color)}>
        <props.header.icon className={cn("p-2 mr-4 h-9 w-9 rounded-full text-xl font-bold", bgColor)} />
        <p className="leading-6  scroll-m-20 text-xl font-semibold tracking-tight ">{props.header.title}</p>
        <button onClick={toggle} className="ml-auto text-blue-600 hover:text-blue-800">
          {isHide ? <EyeIcon className="h-5 w-5" /> : <EyeOffIcon className="h-5 w-5" />}
        </button>
      </div>
      <div className="flex justify-end items-center grow">
        <p className={cn("text-center text-3xl font-bold mb-2 py-3", color, isHide && "hidden")}>
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