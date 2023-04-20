
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { redAsterisk } from "@/pages/dashboard/checkup/new";
import { Controller, useFormContext } from "react-hook-form";


export function PatientInfoForm() {
    const { register, control } = useFormContext()
    return (
        <div>
            <div className="bg-white overflow-hidden sm:rounded-lg outline outline-1 outline-slate-200 mb-4 rounded-sm">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-blue-600">Data Pasien</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Isi data pasien disini dengan benar, agar pencarian data
                        pasien lebih mudah.
                    </p>
                </div>
                    <div className="px-4 pb-6 pt-1 sm:pt-5 sm:px-6">
                        <div className="md:grid md:grid-cols-1 md:gap-6">
                            <div className="mt-5 md:col-span-2 md:mt-0">
                                <div>
                                    <div className="grid grid-cols-6 gap-6">
                                        <div className="col-span-6 sm:col-span-3">
                                            <label
                                                htmlFor="first-name"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Nama pasien {redAsterisk}
                                            </label>
                                            <Input
                                                type="text"
                                                id="first-name"
                                                autoComplete="given-name"
                                                className="mt-1 bg-white"
                                                {...register("name", { required: true })}
                                            />
                                        </div>

                                        <div className="col-span-6 sm:col-span-3">
                                            <label
                                                htmlFor="phone-number"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Nomor telfon
                                            </label>
                                            <div className="relative mt-1 rounded-md shadow-sm">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <span className="text-gray-500 sm:text-sm">+62</span>
                                                </div>
                                                <Input
                                                    type="number"
                                                    id="phone-number"
                                                    autoComplete="phone-number"
                                                    // className="mt-1 "
                                                    className="block w-full rounded-md border-gray-300 bg-white pl-11 pr-12 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                    {...register("phone", {
                                                        required: true,
                                                        maxLength: 13,
                                                        valueAsNumber: true,
                                                    })}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-span-6 sm:col-span-3">
                                            <label
                                                htmlFor="street-address"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Tanggal lahir {redAsterisk}
                                            </label>
                                            <Input
                                                type="date"
                                                id="date-of-birth"
                                                autoComplete="date-of-birth"
                                                className="mt-1 bg-white"
                                                {...register("birthDate", {
                                                    required: true,
                                                    valueAsDate: true,
                                                })}
                                            />
                                        </div>

                                        <div className="col-span-6 sm:col-span-3">
                                            <label
                                                htmlFor="gender"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Jenis kelamin {redAsterisk}
                                            </label>
                                            <Controller
                                                name="gender"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select onValueChange={field.onChange}>
                                                        <SelectTrigger
                                                            className="mt-1 w-full bg-white"
                                                            ref={field.ref}
                                                        >
                                                            <SelectValue placeholder="Select gender" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                <SelectItem value="male">Male</SelectItem>
                                                                <SelectItem value="female">Female</SelectItem>
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                        </div>

                                        <div className="col-span-6">
                                            <label
                                                htmlFor="street-address"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Alamat Rumah {redAsterisk}
                                            </label>
                                            <Input
                                                type="text"
                                                id="street-address"
                                                autoComplete="street-address"
                                                className="mt-1 bg-white"
                                                {...register("address", { required: true })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
            {/* <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Patient
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Isi data pasien disini dengan benar, agar pencarian data
                        pasien lebih mudah.
                    </p>
                </div>
                <div className="mt-5 md:col-span-2 md:mt-0">
                    <div>
                        <div className="grid grid-cols-6 gap-6">
                            <div className="col-span-6 sm:col-span-3">
                                <label
                                    htmlFor="first-name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Nama pasien {redAsterisk}
                                </label>
                                <Input
                                    type="text"
                                    id="first-name"
                                    autoComplete="given-name"
                                    className="mt-1 bg-white"
                                    {...register("name", { required: true })}
                                />
                            </div>

                            <div className="col-span-6 sm:col-span-3">
                                <label
                                    htmlFor="phone-number"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Nomor telfon
                                </label>
                                <div className="relative mt-1 rounded-md shadow-sm">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <span className="text-gray-500 sm:text-sm">+62</span>
                                    </div>
                                    <Input
                                        type="number"
                                        id="phone-number"
                                        autoComplete="phone-number"
                                        // className="mt-1 "
                                        className="block w-full rounded-md border-gray-300 bg-white pl-11 pr-12 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        {...register("phone", {
                                            required: true,
                                            maxLength: 13,
                                            valueAsNumber: true,
                                        })}
                                    />
                                </div>
                            </div>

                            <div className="col-span-6">
                                <label
                                    htmlFor="street-address"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Alamat Rumah {redAsterisk}
                                </label>
                                <Input
                                    type="text"
                                    id="street-address"
                                    autoComplete="street-address"
                                    className="mt-1 bg-white"
                                    {...register("address", { required: true })}
                                />
                            </div>

                            <div className="col-span-6">
                                <label
                                    htmlFor="gender"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Jenis kelamin {redAsterisk}
                                </label>
                                <Controller
                                    name="gender"
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange}>
                                            <SelectTrigger
                                                className="mt-1 w-full bg-white"
                                                ref={field.ref}
                                            >
                                                <SelectValue placeholder="Select gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="male">Male</SelectItem>
                                                    <SelectItem value="female">Female</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>

                            <div className="col-span-6">
                                <label
                                    htmlFor="street-address"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Tanggal lahir {redAsterisk}
                                </label>
                                <Input
                                    type="date"
                                    id="date-of-birth"
                                    autoComplete="date-of-birth"
                                    className="mt-1 bg-white"
                                    {...register("birthDate", {
                                        required: true,
                                        valueAsDate: true,
                                    })}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
        </div>
    )
}