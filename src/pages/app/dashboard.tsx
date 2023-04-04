"use client"

import Layout from "@/components/dashboard/Layout"
import { ReactElement } from "react"

export default function Dashboard() {
  return (
    <p>Hello</p>
  )
}

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

Dashboard.authRequired = true;