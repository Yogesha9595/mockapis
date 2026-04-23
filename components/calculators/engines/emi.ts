export function calculateEMI(
  amount: number,
  rate: number,
  years: number
) {
  const r = rate / 12 / 100;
  const n = years * 12;

  if (!amount || !r || !n) {
    return {
      emi: 0,
      totalPayment: 0,
      totalInterest: 0,
      schedule: [],
    };
  }

  const emi =
    (amount * r * Math.pow(1 + r, n)) /
    (Math.pow(1 + r, n) - 1);

  let balance = amount;
  const schedule = [];

  for (let i = 1; i <= n; i++) {
    const interest = balance * r;
    const principal = emi - interest;
    balance -= principal;

    schedule.push({
      month: i,
      principal: Math.round(principal),
      interest: Math.round(interest),
      balance: Math.max(0, Math.round(balance)),
    });
  }

  const totalPayment = emi * n;
  const totalInterest = totalPayment - amount;

  return {
    emi: Math.round(emi),
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalInterest),
    schedule,
  };
}