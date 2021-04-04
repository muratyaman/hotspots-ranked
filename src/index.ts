import fse from 'fs-extra';
import path from 'path';
import { newConfig } from './config';
import { findAreas } from './areas';
import { findHousesForSale } from './housesForSale';
import { findHousesToLet } from './housesToLet';
import { calcMonthlyPaymentAmount, sortByRankInDescOrder } from './math';
import { calcRankForArea } from './rank';
import { IConfig, IHouseToLet, IHouseForSale, IRank } from './types';
import { formatMoney, formatPctg } from './i18n';
import { sleep } from './utils';
import { randInt } from './mocks';

main();

async function main() {
  console.log();
  console.log('main() start');
  console.log();
  const config = newConfig(process.env);
  console.log('config', config);
  const areas = await findAreas(config);
  
  const budget = config.depositMax / (1 - config.loanPctgMax);
  const budgetMin = Math.round(budget * 0.6); // -40%
  const budgetMax = Math.round(budget * 1.1); // +10%
  console.log('Budget range: ', formatMoney(budgetMin), formatMoney(budgetMax));

  const annualRateMin = (config.annualInterestRate - 0.01);
  const annualRateMax = (config.annualInterestRate + 0.01);
  console.log('Mortgage rate/yr range: ', formatPctg(annualRateMin), formatPctg(annualRateMax));

  const monthlyPaymentMin = Math.round(calcMonthlyPaymentAmount(budgetMin, annualRateMin / 12.0, config.months));
  const monthlyPaymentMax = Math.round(calcMonthlyPaymentAmount(budgetMax, annualRateMax / 12.0, config.months));
  console.log('Mortgage payment/mon range: ', formatMoney(monthlyPaymentMin), formatMoney(monthlyPaymentMax));
  console.log();

  // init search operations for each area
  const ranking: IRank[] = [];

  for (let area of areas) {
    await sleep(randInt(10, 5) * 1000); // wait 5-10s
    const housesForSale = await findHousesForSaleInArea(config, area, budgetMin, budgetMax);
    
    if (housesForSale && housesForSale.length) { // ignore if no houses for sale
      await sleep(randInt(10, 5) * 1000); // wait 5-10s
      const housesToLet = await findHousesToLetInArea(config, area, monthlyPaymentMin, monthlyPaymentMax);
    
      if (housesToLet && housesToLet.length) { // ignore if no houses to rent
        console.info('Area:', area, 'Rank: ...');
        const rank = calcRankForArea(area, housesForSale, housesToLet);
        console.info('Area:', area, 'Rank:', rank);
        ranking.push({ area, rank });
      }
    }
  }

  // ** sort by rank **
  console.log();
  console.log('RANKING acc.to. avg annual yield');
  console.log();
  ranking.sort(sortByRankInDescOrder);
  ranking.forEach((r, i) => {
    console.log(1 + i, 'Area:', r.area, 'Rank:', r.rank);
  });

  console.log();
  console.log('main() end!');
  console.log();
  process.exit(0);
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
  const allHouses = upsertHousesForSale(area, housesForSale);
  console.log('Area:', area, '... TOTAL', allHouses.length, 'houses for sale');
  return allHouses;
}

async function findHousesToLetInArea(config: IConfig, area: string, monthlyPaymentMin: number, monthlyPaymentMax: number) {
  const housesToLet = await findHousesToLet(config, {
    area,
    priceMin: monthlyPaymentMin,
    priceMax: monthlyPaymentMax,
    bedRoomsMin: config.bedRoomsMin,
    bedRoomsMax: config.bedRoomsMax,
  });
  console.log('Area:', area, '... found', housesToLet.length, ' houses to let');
  const allHouses = upsertHousesToLet(area, housesToLet);
  console.log('Area:', area, '... TOTAL', allHouses.length, 'houses to let');
  return allHouses;
}

function upsertHousesForSale(area: string, houses: IHouseForSale[]): IHouseForSale[] {
  const file = path.resolve(__dirname, '..', 'logs', 'sales', `${area}.json`);
  const currentHousesJson = fse.pathExistsSync(file) ? fse.readFileSync(file).toString() : '[]';
  const currentHouses: IHouseForSale[] = JSON.parse(currentHousesJson);
  houses.forEach(h => {
    const found = currentHouses.find(ch => ch.id === h.id);
    if (found) {
      // TODO: compare/update ?!
    } else {
      currentHouses.push(h);
    }
  });
  fse.writeFileSync(file, JSON.stringify(currentHouses, null, ' '));
  return currentHouses;
}

function upsertHousesToLet(area: string, houses: IHouseToLet[]): IHouseToLet[] {
  const file = path.resolve(__dirname, '..', 'logs', 'lettings', `${area}.json`);
  const currentHousesJson = fse.pathExistsSync(file) ? fse.readFileSync(file).toString() : '[]';
  const currentHouses: IHouseToLet[] = JSON.parse(currentHousesJson);
  houses.forEach(h => {
    const found = currentHouses.find(ch => ch.id === h.id);
    if (found) {
      // TODO: compare/update ?!
    } else {
      currentHouses.push(h);
    }
  });
  fse.writeFileSync(file, JSON.stringify(currentHouses, null, ' '));
  return currentHouses;
}
