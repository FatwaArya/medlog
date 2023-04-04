import { Input } from "@/components/ui/input"
import { Loader2, SearchIcon } from "lucide-react"
import { api } from "@/utils/api";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import relativeTime from "dayjs/plugin/relativeTime";
import 'dayjs/locale/id' // ES 2015 

dayjs.extend(relativeTime)





export default function PatientList() {
    const { data: patientData, isLoading } = api.patient.getNewestPatients.useQuery()



    return (
        <div className="bg-white overflow-hidden shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">  <div className="px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-xl text-[#3366FF] font-semibold">Create Order</h1>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <Input placeholder="Search" />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </div>
                        </div>

                    </div>
                </div>
                <div className="mt-8 flex flex-col">
                    <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle">
                            <div className="overflow-hidden ring-1 ring-black ring-opacity-5">
                                <table className="min-w-full divide-y bg-white">
                                    <thead className="bg-white">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8"
                                            >
                                                Patients
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Sex
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Date of Birth
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                NIK
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                EMR
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Last Visit
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {isLoading ? (
                                            <tr>
                                                <div className="flex items-center justify-center">
                                                    <Loader2 className="animate-spin h-8 w-8" />
                                                </div>
                                            </tr>
                                        ) :
                                            (patientData?.map((person) => (
                                                <tr key={person.patient?.id}>
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                                                        {person.patient?.name}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 capitalize">{person.patient?.gender}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{dayjs(person.patient?.birthDate).format('DD MMM YYYY')}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.patient?.NIK}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.patient?.NIK}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{dayjs(person.createdAt).fromNow()}</td>

                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 items-center flex">
                                                        <Button variant="solidBlue" className=" text-sm font-normal px-6">Create Order</Button>
                                                    </td>
                                                </tr>
                                            )))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div></div>
        </div>

    )
}