import { type RouterOutputs } from "@/utils/api";
import dayjs from "dayjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

type AdminInfo = RouterOutputs["admin"]["getAdminById"];

export const AdminDescription = (props: AdminInfo) => {
    return (
        <>
            <div className="mb-4 overflow-hidden rounded-sm bg-white shadow outline outline-1 outline-slate-200 sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg font-medium leading-6 text-blue-600">
                        Informasi User
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Informasi dasar user.
                    </p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-gray-500">
                                Foto Profil
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 capitalize">
                                <Avatar className="h-14 w-14">
                                    <AvatarImage src={props?.image as string} />
                                    <AvatarFallback>
                                        <User />
                                    </AvatarFallback>
                                </Avatar>
                            </dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">
                                Nama Lengkap
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 capitalize">{props?.name}</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">
                                Nomor Telefon
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                {props?.phone ?? "Tidak ada nomor telepon"}
                            </dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">
                                Email
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                {props?.email}
                            </dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">
                                Status Berlangganan
                            </dt>
                            <dd className="mt-1 items-center flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                {!props?.subscribedToAdmin.length ? (
                                    <span>Belum langganan</span>
                                ) : (
                                    <span>Berlangganan</span>
                                )}
                            </dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">
                                Berlangganan Hingga
                            </dt>
                            <dd className="mt-1 items-center flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                {!props?.subscribedToAdmin.length ? (
                                    <span>-</span>
                                ) : (
                                    <span>
                                        {dayjs(props?.subscribedToAdmin[0]?.subscribedUntil).format("DD MMMM YYYY")}
                                    </span>
                                )}
                            </dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">
                                Total Pasien
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                {props?.Patient.length} 
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </>
    )
}