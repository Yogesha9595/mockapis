import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportToPDF(schedule: any[]) {
  const doc = new jsPDF();

  doc.text("Loan Amortization Schedule", 14, 10);

  autoTable(doc, {
    startY: 20,
    head: [["Month", "Principal", "Interest", "Balance"]],
    body: schedule.map((row) => [
      row.month,
      row.principal,
      row.interest,
      row.balance,
    ]),
  });

  doc.save("loan-schedule.pdf");
}