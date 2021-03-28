import { IHouseForSale, IHouseToLet } from './types';
import { calcAnnualYield, calcAvg, calcMax, calcMin } from './math';
import { convertMoney, formatMoney, formatPctg } from './i18n';

export function calcRankForArea(
  area: string,
  housesForSale: IHouseForSale[],
  housesToLet: IHouseToLet[],
): number {
  let avgPrice = 0, minPrice = 0, maxPrice = 0;
  let avgRent = 0, minRent = 0, maxRent = 0;
  let rank = 0, avgAnnualYield = 0, minAnnualYield = 0, maxAnnualYield = 0;

  if (housesForSale.length) {
    const salesPrices = housesForSale.map(h => convertMoney(h.price));
    avgPrice = calcAvg(salesPrices);
    minPrice = calcMin(salesPrices);
    maxPrice = calcMax(salesPrices);
    console.log('Area:', area, 'MIN price', formatMoney(minPrice));
    console.log('Area:', area, 'AVG price', formatMoney(avgPrice));
    console.log('Area:', area, 'MAX price', formatMoney(maxPrice));
  }
  if (housesToLet.length) {
    const lettingPrices = housesToLet.map(h => convertMoney(h.price));
    avgRent = calcAvg(lettingPrices);
    minRent = calcMin(lettingPrices);
    maxRent = calcMax(lettingPrices);
    console.log('Area:', area, 'MIN rent', formatMoney(minRent));
    console.log('Area:', area, 'AVG rent', formatMoney(avgRent));
    console.log('Area:', area, 'MAX rent', formatMoney(maxRent));
  }

  if (maxPrice > 0 && minRent > 0) { // worst case scenario
    minAnnualYield = calcAnnualYield(minRent, maxPrice);
    console.log('Area:', area, 'MIN Annual Yield', formatPctg(minAnnualYield));
  }
  if (avgPrice > 0 && avgRent > 0) {
    avgAnnualYield = calcAnnualYield(avgRent, avgPrice);
    console.log('Area:', area, 'AVG Annual Yield', formatPctg(avgAnnualYield));
  }
  if (minPrice > 0 && maxRent > 0) { // best case scenario
    maxAnnualYield = calcAnnualYield(maxRent, minPrice);
    console.log('Area:', area, 'MAX Annual Yield', formatPctg(maxAnnualYield));
  }

  // TODO: review ranking formula
  rank = avgAnnualYield;

  return rank;
}
