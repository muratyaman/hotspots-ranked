import { IConfig, IProcessEnv } from './types';

require('dotenv').config();

export function newConfig(penv: IProcessEnv): IConfig {
  return {
    maxDeposit: configFloat(penv.MAX_DEPOSIT, '10000.0'),
    maxLoanPctg: configFloat(penv.ANNUAL_PCTG_RATE, '90.0') / 100.0,
    monthlyInterestRate: configFloat(penv.ANNUAL_PCTG_RATE, '1.0') / 100.0 / 12.0,
    months: configInt(penv.YEARS) * 12,
    areas: (penv.AREAS ?? '').split(','),
    minBedRooms: configInt(penv.MIN_BEDROOMS ?? '2'),
    maxBedRooms: configInt(penv.MAX_BEDROOMS ?? '3'),
  };
}

export function configFloat(v?: string, def = '0'): number {
  return Number.parseFloat(v ? v : def);
}

export function configInt(v?: string, def = '0'): number {
  return Number.parseInt(v ? v : def);
}
