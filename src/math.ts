import { IRank } from "./types";

// @see https://en.wikipedia.org/wiki/Amortization_calculator
export function calcMonthlyPaymentAmount(
  netLoan: number,
  monthlyInterestRate: number,
  months: number,
): number {
  return (netLoan * monthlyInterestRate) / (1.0 - Math.pow(1.0 + monthlyInterestRate, -months));
}

export function calcAnnualYield(avgRent: number, avgPrice: number): number {
  return 12.0 * avgRent / avgPrice;
}

export function calcAvg(nums: number[]): number {
  let sum = 0;
  nums.forEach(n => { sum += n; });
  return sum / nums.length;
}

export function calcMin(nums: number[]): number {
  return Math.min.call(null, ...nums);
}

export function calcMax(nums: number[]): number {
  return Math.max.call(null, ...nums);
}

export function sortByRankInDescOrder(a: IRank, b: IRank): number {
  if (a.rank < b.rank) return 1;  // -1 for ASC
  if (a.rank > b.rank) return -1;
  return 0; // same
}
