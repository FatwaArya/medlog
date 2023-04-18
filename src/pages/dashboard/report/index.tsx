import Layout from "@/components/dashboard/Layout";
import { PasienPlusPage } from "@/pages/_app";
import { CalendarDateRangePicker } from "@/components/ui/datepicker/calendarDateRangePicker";
import { CalendarDatePicker } from "@/components/ui/datepicker/calendarDatePicker";


const Report: PasienPlusPage = () => {
    return (
        <>
            <h1>Report</h1>
            <CalendarDateRangePicker />
            <CalendarDatePicker />
        </>
    )
}

export default Report

Report.authRequired = true

Report.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>
}
