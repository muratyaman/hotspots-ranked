import fse from 'fs-extra';
import path from 'path';
import { newConfig } from './config';
import { findAreas } from './areas';
import { findHousesForSale } from './housesForSale';
import { findHousesToLet } from './housesToLet';
import { calcMonthlyPaymentAmount, sortByRankInDescOrder } from './math';
import { calcRankForArea } from './rank';
import { IConfig, IRank } from './types';
import { formatMoney, formatPctg } from './i18n';

main();

async function main() {
  const config = newConfig(process.env);
  console.log('config', config);
  const areas = await findAreas(config);
  
  const budget = config.depositMax / (1 - config.loanPctgMax);
  const budgetMin = budget * 0.7; // -30%
  const budgetMax = budget * 1.1; // +10%
  console.log('Budget range: ', formatMoney(budgetMin), formatMoney(budgetMax));

  const annualRateMin = (config.annualInterestRate - 0.01);
  const annualRateMax = (config.annualInterestRate + 0.01);
  console.log('Mortgage rate/yr range: ', formatPctg(annualRateMin * 100.0), formatPctg(annualRateMax * 100.0));

  const monthlyPaymentMin = calcMonthlyPaymentAmount(budgetMin, annualRateMin / 12.0, config.months);
  const monthlyPaymentMax = calcMonthlyPaymentAmount(budgetMax, annualRateMax / 12.0, config.months);
  console.log('Mortgage payment/mon range: ', formatMoney(monthlyPaymentMin), formatMoney(monthlyPaymentMax));

  // init search operations for each area
  const ranking: IRank[] = [];

  for (let area of areas) {
    const housesForSale = await findHousesForSaleInArea(config, area, budgetMin, budgetMax);
    saveHouses(area, JSON.stringify(housesForSale, null, ' '), 'sales');

    //const housestoLet = await findHousesToLetInArea(config, area, monthlyPaymentMin, monthlyPaymentMax);
    //const rank = calcRankForArea(area, housesForSale, housestoLet);
    //console.info('Area:', area, 'Rank:', rank);
    //ranking.push({ area, rank });
  }

  // ** sort by rank **
  // console.log('_______');
  // console.log('RANKING');
  // console.log('_______');
  // ranking.sort(sortByRankInDescOrder);
  // ranking.forEach((r, i) => {
  //   console.log(1 + i, 'Area:', r.area, 'Rank:', r.rank);
  // });
}

async function findHousesForSaleInArea(config: IConfig, area: string, budgetMin: number, budgetMax: number) {
  console.log('Area:', area, '...');
  const housesForSale = await findHousesForSale(config, {
    area,
    priceMin: budgetMin,
    priceMax: budgetMax,
    bedRoomsMin: config.bedRoomsMin,
    bedRoomsMax: config.bedRoomsMax,
  });
  console.log('Area:', area, '... found', housesForSale.length, 'houses for sale');
  // TODO: add to list

  return housesForSale;
}

async function findHousesToLetInArea(config: IConfig, area: string, monthlyPaymentMin: number, monthlyPaymentMax: number) {
  const housestoLet = await findHousesToLet(config, {
    area,
    priceMin: monthlyPaymentMin,
    priceMax: monthlyPaymentMax,
    bedRoomsMin: config.bedRoomsMin,
    bedRoomsMax: config.bedRoomsMax,
  });
  console.log('Area:', area, '... found', findHousesToLet.length, 'houses to let');
  // TODO: add to list

  return housestoLet;
}

function saveHouses(area: string, housesJson: string, section = 'sales') {
  const file = path.resolve(__dirname, '..', 'logs', section, `${area}.json`);
  return fse.writeFileSync(file, housesJson);
}
