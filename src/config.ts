import { IConfig, IProcessEnv } from './types';

require('dotenv').config();

export function newConfig(penv: IProcessEnv): IConfig {
  return {
    depositMax: configFloat(penv.DEPOSIT_MAX, '10000.0'),
    loanPctgMax: configFloat(penv.LOAN_PCTG_MAX, '90.0') / 100.0,
    annualInterestRate: configFloat(penv.ANNUAL_PCTG_RATE, '5.0') / 100.0,
    monthlyInterestRate: configFloat(penv.ANNUAL_PCTG_RATE, '5.0') / 100.0 / 12.0,
    months: configInt(penv.YEARS) * 12.0,
    areas: (penv.AREAS ?? '').split(','),
    bedRoomsMin: configInt(penv.BEDROOMS_MIN ?? '3'),
    bedRoomsMax: configInt(penv.BEDROOMS_MAX ?? '3'),
    sales: {
      url: penv.SALES_URL ?? 'http://localhost',
      resultsSelector: penv.SALES_RESULTS_SELECTOR ?? 'p.results',
      detailsSelector: penv.SALES_DETAILS_SELECTOR ?? 'div.details',
      detailsTitleSelector: penv.SALES_DETAILS_TITLE_SELECTOR ?? 'p.title',
      detailsPriceSelector: penv.SALES_DETAILS_PRICE_SELECTOR ?? 'div.price',
      detailsBedRoomsSelector: penv.SALES_DETAILS_BEDROOMS_SELECTOR ?? 'div.price',
      nextLinkSelector: penv.SALES_NEXT_LINK_SELECTOR ?? 'a.next',
    },
    lettings: {
      url: penv.LETTINGS_URL ?? 'http://localhost',
      resultsSelector: penv.LETTINGS_RESULTS_SELECTOR ?? 'p.results',
      detailsSelector: penv.LETTINGS_DETAILS_SELECTOR ?? 'div.details',
      detailsTitleSelector: penv.LETTINGS_DETAILS_TITLE_SELECTOR ?? 'p.title',
      detailsPriceSelector: penv.LETTINGS_DETAILS_PRICE_SELECTOR ?? 'a.price',
      detailsBedRoomsSelector: penv.LETTINGS_DETAILS_BEDROOMS_SELECTOR ?? 'a.price',
      nextLinkSelector: penv.LETTINGS_NEXT_LINK_SELECTOR ?? 'a.next',
    },
  };
}

export function configDec(v?: string, def = '0'): number {
  return Number(v ? v : def);
}

export function configFloat(v?: string, def = '0'): number {
  return Number.parseFloat(v ? v : def);
}

export function configInt(v?: string, def = '0'): number {
  return Number.parseInt(v ? v : def);
}

export function configBool(v?: string): boolean {
  return v ? ['1', 'true', 'yes'].includes(v.toLowerCase()) : false;
}
