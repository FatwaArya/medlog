import Layout from "@/components/dashboard/Layout";
import type { PasienPlusPage } from "@/pages/_app";
import { CalendarDateRangePicker } from "@/components/ui/datepicker/calendarDateRangePicker";
import { CalendarDatePicker } from "@/components/ui/datepicker/calendarDatePicker";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { useState } from "react";
import { api } from "@/utils/api";


const Report: PasienPlusPage = () => {
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 20),
    })
    const { data: reportsData } = api.record.getRecordReports.useQuery({
        from: date?.from as Date,
        to: date?.to as Date,
    })




    return (
        <>
            <h1>Report</h1>
            <div className="flex justify-between">
                <CalendarDatePicker />

                <CalendarDateRangePicker date={date} setDate={setDate} />
            </div>
            <pre>
                {JSON.stringify(reportsData, null, 2)}
            </pre>

        </>
    )
}

export default Report

Report.authRequired = true

Report.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>
}
