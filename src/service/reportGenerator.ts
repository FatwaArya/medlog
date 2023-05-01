import jsPDF from "jspdf";
import "jspdf-autotable";
import dayjs from "dayjs";

const generatePDF = (patients : any[]) => {
    const doc = new jsPDF();

    const tblColumn = [
        'Tanggal Pemeriksaan',
        'Nama Pasien',
        'Alamat Pasien',
        'Nomor Telepon',
        'Nama Perawat',
        'Biaya'
    ];
    const tblRows: any[][] = [];

    patients.forEach(data => {
        const rupiahFormat = data?.pay.toLocaleString('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        })
        const patientsData = [  
            dayjs(data?.createdAt).format('DD MMMM YYYY'),
            data?.patient.name,
            data?.patient.address,
            data?.patient.phone,
            data?.patient.user.name,
            rupiahFormat,
        ]
        tblRows.push(patientsData)
    })

    doc.autoTable(tblColumn, tblRows, { startY: 20 })
    const dateFormat = dayjs(new Date()).format('DD MMMM YYYY')
    doc.text(`Laporan Pasien Tanggal : ${dateFormat}`, 14, 15);
    doc.save(`report_${dateFormat}.pdf`);
}

export default generatePDF;