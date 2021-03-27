import { IRank } from "./types";

// @see https://en.wikipedia.org/wiki/Amortization_calculator
export function calcMonthlyPaymentAmount(
  netLoan: number,
  monthlyInterestRate: number,
  months: number,
): number {
  return (netLoan * monthlyInterestRate) / (1.0 - Math.pow(1.0 + monthlyInterestRate, -months));
}

export function calcAvg(nums: number[]) {
  let sum = 0;
  nums.forEach(n => { sum += n; });
  return sum / nums.length;
}

export function sortByRankInDescOrder(a: IRank, b: IRank) {
  if (a.rank < b.rank) return 1;  // -1 for ASC
  if (a.rank > b.rank) return -1;
  return 0; // same
}
