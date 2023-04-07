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
      {/* <div className="ml-16 pb-6 sm:pb-7"> */}
      {/* <p
                        className={classNames(
                            item.changeType === 'increase' ? 'text-green-600' : 'text-red-600',
                            'ml-2 flex items-baseline text-sm font-semibold'
                        )}
                    >
                        {item.changeType === 'increase' ? (
                                    <ArrowSmUpIcon className="self-center flex-shrink-0 h-5 w-5 text-green-500" aria-hidden="true" />
                                ) : (
                                    <ArrowSmDownIcon className="self-center flex-shrink-0 h-5 w-5 text-red-500" aria-hidden="true" />
                                )}

                        <span className="sr-only">{item.changeType === 'increase' ? 'Increased' : 'Decreased'} by</span>
                        {item.change}
                    </p> */}
      {/* <div className="absolute bottom-0 inset-x-0 bg-gray-50 px-4 py-4 sm:px-6">
                        <div className="text-sm">
                            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                {' '}
                                View all<span className="sr-only"> {name} stats</span>
                            </a>
                        </div>
                    </div> */}
      {/* </div> */}
    </div>
  );
};
