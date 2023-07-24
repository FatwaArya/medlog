import Head from "next/head";

import { CallToAction } from "@/components/landing/CallToAction";
import { Faqs } from "@/components/landing/Faqs";
import { Footer } from "@/components/landing/Footer";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Pricing } from "@/components/landing/Pricing";
import { PrimaryFeatures } from "@/components/landing/PrimaryFeatures";
import { SecondaryFeatures } from "@/components/landing/SecondaryFeatures";
import { Testimonials } from "@/components/landing/Testimonials";

export default function Index() {
  // const { data: Revenue } = api.record.getStatRevenue.useQuery()
  // const { data: Patient } = api.patient.getStatPatients.useQuery()
  // const { data: chart } = api.patient.getStatLine.useQuery()
  return (
    <>
      <Head>
        <title>
          PasienPlus - Membantu Perawat dalam mengelola pasien
        </title>
        <meta
          name="description"
          content="Most bookkeeping software is accurate, but hard to use. We make the opposite trade-off, and hope you don’t get audited."
        />
      </Head>
      <Header />
      <main>
        <Hero />
        <PrimaryFeatures />
        {/* <SecondaryFeatures />
        <CallToAction /> */}
        <Testimonials />
        <Pricing />
        <Faqs />
      </main>
      <Footer />
    </>
  );
}
