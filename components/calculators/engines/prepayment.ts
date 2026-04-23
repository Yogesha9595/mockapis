export function calculatePrepayment(
  amount: number,
  rate: number,
  years: number,
  extraEMI: number = 0,
  lumpSum: number = 0,
  lumpMonth: number = 0
) {
  const P = Number(amount) || 0;
  const r = Number(rate) / 12 / 100 || 0;
  const n = Number(years) * 12 || 0;

  if (!P || !n) {
    return {
      emi: 0,
      totalInterest: 0,
      totalPayment: 0,
      months: 0,
      interestSaved: 0,
      monthsSaved: 0,
      schedule: [],
      baseSchedule: [],
    };
  }

  // 🔥 EMI CALCULATION (handles 0% rate)
  const emi =
    r === 0
      ? P / n
      : (P * r * Math.pow(1 + r, n)) /
        (Math.pow(1 + r, n) - 1);

  // =========================
  // 🔵 BASELINE (NO PREPAYMENT)
  // =========================
  let baseBalance = P;
  const baseSchedule: any[] = [];

  for (let i = 1; i <= n; i++) {
    const interest = r === 0 ? 0 : baseBalance * r;
    const principal = emi - interest;

    baseBalance -= principal;

    baseSchedule.push({
      month: i,
      principal: Math.round(principal),
      interest: Math.round(interest),
      balance: Math.max(0, Math.round(baseBalance)),
    });
  }

  const baseTotalPayment = emi * n;
  const baseTotalInterest = baseTotalPayment - P;

  // =========================
  // 🟢 WITH PREPAYMENT
  // =========================
  let balance = P;
  let month = 0;
  const schedule: any[] = [];

  while (balance > 0 && month < n * 2) {
    month++;

    let interest = r === 0 ? 0 : balance * r;
    let principal = emi - interest;

    // 🔥 EXTRA EMI
    principal += Number(extraEMI) || 0;

    // 🔥 LUMP SUM
    if (month === lumpMonth) {
      principal += Number(lumpSum) || 0;
    }

    if (principal > balance) {
      principal = balance;
    }

    balance -= principal;

    schedule.push({
      month,
      principal: Math.round(principal),
      interest: Math.round(interest),
      balance: Math.max(0, Math.round(balance)),
    });

    if (balance <= 0) break;
  }

  const totalPaid = schedule.reduce(
    (sum, row) => sum + row.principal + row.interest,
    0
  );

  const totalInterest = totalPaid - P;

  // =========================
  // 💰 SAVINGS
  // =========================
  const interestSaved = baseTotalInterest - totalInterest;
  const monthsSaved = n - month;

  return {
    emi: Math.round(emi),

    totalInterest: Math.round(totalInterest),
    totalPayment: Math.round(totalPaid),
    months: month,

    // 🔥 COMPARISON DATA
    baseTotalInterest: Math.round(baseTotalInterest),
    interestSaved: Math.max(0, Math.round(interestSaved)),
    monthsSaved: Math.max(0, monthsSaved),

    schedule,
    baseSchedule,
  };
}