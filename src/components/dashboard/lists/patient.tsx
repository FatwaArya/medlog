import { Input } from "@/components/ui/input"
import { SearchIcon } from "lucide-react"

/* This example requires Tailwind CSS v2.0+ */
const people = [
    { name: 'Lindsay Walton', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member' },
    // More people...
]

export default function PatientList() {
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
                                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {people.map((person) => (
                                            <tr key={person.email}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                                                    {person.name}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.title}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.email}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.role}</td>
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                                                    <a href="#" className="text-indigo-600 hover:text-indigo-900">
                                                        Create Order<span className="sr-only">, {person.name}</span>
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
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