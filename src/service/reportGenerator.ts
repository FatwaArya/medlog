import jsPDF from "jspdf";
import "jspdf-autotable";
import dayjs from "dayjs";
import { RouterOutputs } from "@/utils/api";
import { rupiah } from "@/utils/intlformat";

type ReportData = RouterOutputs["record"]["getRecordReports"];
type ReportColumn = ReportData[number];

const generatePDF = (patients: ReportData) => {
  const doc = new jsPDF();

  const tblColumn = [
    "Tanggal Pemeriksaan",
    "Nama Pasien",
    "Alamat Pasien",
    "Nomor Telepon",
    "Nama Perawat",
    "Biaya",
  ];
  const tblRows: ReportColumn[keyof ReportColumn][][] = [];

  patients.forEach((data) => {
    const patientsData = [
      dayjs(data?.createdAt).format("DD MMMM YYYY"),
      data?.patient.name,
      data?.patient.address,
      data?.patient.phone,
      data?.patient.user.name,
      rupiah.format(data?.pay),
    ];
    tblRows.push(patientsData);
  });

  //@ts-ignore
  doc.autoTable(tblColumn, tblRows, { startY: 20 });
  const dateFormat = dayjs(new Date()).format("DD MMMM YYYY");
  doc.save(`report_${dateFormat}.pdf`);
};

export default generatePDF;
