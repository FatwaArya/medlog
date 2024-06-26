
import { CalendarDatePicker } from "@/components/ui/datepicker/calendarDatePicker";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { redAsterisk } from "@/pages/dashboard/patients/checkup/new";
import { RouterInputs } from "@/utils/api";
import { Controller, useFormContext } from "react-hook-form";
import { PatternFormat } from "react-number-format";
type NewCheckupPatient =
    RouterInputs["patient"]['createNewPatient'];

export function PatientInfoForm() {
    const { register, control, formState: { errors } } = useFormContext<NewCheckupPatient>()
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
                                            placeholder="Jono Dormand"
                                            className="mt-1 bg-white"
                                            {...register('name', { required: true })}
                                        />
                                        {errors.name && <span className="text-red-500 text-sm">Nama pasien harus diisi</span>}
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
                                            <Controller
                                                name='phone'
                                                control={control}
                                                render={({ field }) => (
                                                    <PatternFormat
                                                        format="####-####-####"
                                                        customInput={Input}
                                                        onValueChange={(values) => {
                                                            field.onChange(values.value)
                                                        }}
                                                        className="block w-full rounded-md border-gray-300 bg-white pl-11 pr-12 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                        name={field.name}
                                                        value={field.value}
                                                        onBlur={field.onBlur}
                                                        getInputRef={field.ref}
                                                        autoComplete="phone"
                                                        id="phone-number"

                                                    />
                                                )}
                                                rules={{
                                                    required: false,
                                                    minLength: 10,
                                                    maxLength: 12,

                                                }}
                                            />

                                        </div>
                                        {errors.phone && <span className="text-red-500 text-sm">Nomor minimal 12 digit</span>}

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
                                        {errors.birthDate && <span className="text-red-500 text-sm">Tanggal lahir harus diisi</span>}
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
                                            rules={{ required: true }}
                                        />
                                    </div>


                                    <div className="col-span-6 ">
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
                                            placeholder="Jl. Jendral Sudirman No. 1"
                                            {...register("address", { required: true })}
                                        />
                                        {errors.address && <span className="text-red-500 text-sm">Alamat harus diisi</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}