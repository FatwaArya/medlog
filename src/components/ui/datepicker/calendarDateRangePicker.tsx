import * as React from "react"
import { addDays, format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { type DateRange } from "react-day-picker"

import { cn } from "@/utils/cn"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface DateRangeProps {
    className?: string
    date: DateRange | undefined
    setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>
}



export function CalendarDateRangePicker({
    className,
    date,
    setDate,
}: React.HTMLAttributes<HTMLDivElement> & DateRangeProps) {

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-[300px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "LLL dd, y")} -{" "}
                                    {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="flex w-auto flex-col space-y-2 p-2" align="start">
                    <Select
                        onValueChange={(value) =>
                            setDate(
                                { from: addDays(new Date(), parseInt(value)), to: new Date() }
                            )
                        }
                    >
                        <SelectTrigger>
                            <SelectValue
                                placeholder="Pilih Rentang Waktu"
                            />
                        </SelectTrigger>
                        <SelectContent position='item-aligned' className="mt-12">
                            <SelectItem value="-3">
                                3 Hari Terakhir
                            </SelectItem>
                            <SelectItem value="-7">
                                7 Hari Terakhir
                            </SelectItem>
                            <SelectItem value="-30">
                                30 Hari Terakhir
                            </SelectItem>

                        </SelectContent>
                    </Select>
                    <div className="rounded-md border">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={setDate}
                            numberOfMonths={2}
                        />
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}