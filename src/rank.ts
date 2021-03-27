import { IHouseForSale, IHouseToLet } from './types';
import { calcAvg } from './math';
import { convertMoney, formatMoney, formatPctg } from './i18n';

export function calcRankForArea(
  area: string,
  housesForSale: IHouseForSale[],
  housesToLet: IHouseToLet[],
): number {
  let rank = 0, avgPrice = 0, avgRent = 0, avgAnnualYield = 0;

  if (housesForSale.length) {
    avgPrice = calcAvg(housesForSale.map(h => convertMoney(h.price)));
    console.log('Area: ', area, ' AVG price', formatMoney(avgPrice));
  }
  if (housesToLet.length) {
    avgRent = calcAvg(housesToLet.map(h => convertMoney(h.price)));
    console.log('Area: ', area, ' AVG rent', formatMoney(avgRent));
  }

  if (avgPrice > 0 && avgRent > 0) {
    avgAnnualYield = Math.round(10.0 * 100.0 * (12.0 * avgRent) / avgPrice) / 10.0;
    console.log('Area: ', area, ' AVG Annual Yield', formatPctg(avgAnnualYield));
  }

  // TODO: review ranking formula
  rank = avgAnnualYield;

  return rank;
}
