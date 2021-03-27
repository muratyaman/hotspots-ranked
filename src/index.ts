import { newConfig } from './config';
import { findAreas } from './areas';
import { findHousesForSale } from './housesForSale';
import { findHousesToLet } from './housesToLet';
import { calcMonthlyPaymentAmount, sortByRankInDescOrder } from './math';
import { calcRankForArea } from './rank';
import { IRank } from './types';
import { formatMoney } from './i18n';

async function main() {
  const config = newConfig(process.env);
  const areas = await findAreas(config);
  
  const budget = config.maxDeposit / (1 - config.maxLoanPctg);
  const budgetMin = budget * 0.7; // -30%
  const budgetMax = budget * 1.1; // +10%
  console.log('Budget: ', formatMoney(budgetMin), formatMoney(budgetMax));

  const monthlyPaymentMin = calcMonthlyPaymentAmount(budgetMin, config.monthlyInterestRate, config.months);
  const monthlyPaymentMax = calcMonthlyPaymentAmount(budgetMax, config.monthlyInterestRate, config.months);
  console.log('Mortgage payments: ', formatMoney(monthlyPaymentMin), formatMoney(monthlyPaymentMax));

  // init search operations for each area
  const ranking: IRank[] = [];
  for (let area of areas) {
    console.log('Area:', area, '...');
    const housesForSale = await findHousesForSale({
      area,
      minPrice: budgetMin,
      maxPrice: budgetMax,
      minBedRooms: config.minBedRooms,
      maxBedRooms: config.maxBedRooms,
    });
    console.log('Area:', area, '... found', housesForSale.length, 'houses for sale');
    // TODO: add to list

    const housestoLet = await findHousesToLet({
      area,
      minPrice: monthlyPaymentMin,
      maxPrice: monthlyPaymentMax,
      minBedRooms: config.minBedRooms,
      maxBedRooms: config.maxBedRooms,
    });
    console.log('Area:', area, '... found', findHousesToLet.length, 'houses to let');
    // TODO: add to list

    const rank = calcRankForArea(area, housesForSale, housestoLet);

    console.info('Area:', area, 'Rank:', rank);
    ranking.push({ area, rank });
  }

  // sort by rank
  console.log('_______');
  console.log('RANKING');
  console.log('_______');
  ranking.sort(sortByRankInDescOrder);
  ranking.forEach((r, i) => {
    console.log(1 + i, 'Area:', r.area, 'Rank:', r.rank);
  });
}

main();
