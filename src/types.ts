export interface IProcessEnv {
  MAX_DEPOSIT?: string;

  MAX_LOAN_PCTG?: string;

  ANNUAL_PCTG_RATE?: string;

  YEARS?: string;

  AREAS?: string;

  MIN_BEDROOMS?: string;

  MAX_BEDROOMS?: string;
}

export interface IConfig {
  maxDeposit: number;
  maxLoanPctg: number;
  monthlyInterestRate: number; // ANNUAL_PCTG_RATE / 12
  months: number; // TERM x 12
  areas: string[];
  minBedRooms: number;
  maxBedRooms: number;
}

export interface IFindHousesBaseInput {
  area: string;
  minPrice?: number;
  maxPrice?: number;
  minBedRooms?: number;
  maxBedRooms?: number;
}

export interface IFindHousesForSaleInput extends IFindHousesBaseInput {
  
}

export interface IFindHousesToLetInput extends IFindHousesBaseInput {
  
}


export interface IHouseBase {
  id: string;
  title: string;
  price: string; // "£123,456.78"
  bedRooms: number;
}

export interface IHouseForSale extends IHouseBase {
  
}

export interface IHouseToLet extends IHouseBase {
  
}

export interface IRank {
  area: string;
  rank: number;
}
