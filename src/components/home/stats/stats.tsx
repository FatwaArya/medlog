import { RouterOutputs } from "@/utils/api"
import { UsersIcon, MailOpenIcon, MousePointerClickIcon, DollarSignIcon } from "lucide-react"


type StatUserPatients = RouterOutputs['patient']['getStatPatients']
type StatUserRevenue = RouterOutputs['record']['getStatRevenue']

//overwrite
type StatUser = Partial<StatUserPatients> & Partial<StatUserRevenue> & {
    name: "Revenue" | "Patients"
}



function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}


export const StatsUser = ({ total, lastPatient, lastRevenue, name }: StatUser) => {
    return (
        <div>


            <div
                className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
            >
                <div className="">
                    <div className="flex items-center">
                        <div className="absolute bg-pink-200 rounded-full p-3">
                            <DollarSignIcon className="h-6 w-6 text-pink-500" aria-hidden="true" />
                        </div>
                        <p className="ml-16 text-lg font-medium text-pink-500 truncate">{name}</p>
                    </div>
                    <div className="flex items-end">
                        <p className="text-2xl font-semibold text-pink-500">{
                            // format to idr
                            new Intl.NumberFormat('id-ID', {
                                style: 'currency',
                                currency: 'IDR',
                            }).format(total as number)
                        }</p>

                    </div>
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

        </div>
    )
}