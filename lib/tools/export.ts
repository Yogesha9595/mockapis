export function exportToCSV(schedule: any[]) {
  const headers = ["Month", "Principal", "Interest", "Balance"];

  const rows = schedule.map((row) => [
    row.month,
    row.principal,
    row.interest,
    row.balance,
  ]);

  const csvContent =
    [headers, ...rows].map((e) => e.join(",")).join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "loan-schedule.csv";
  a.click();
}