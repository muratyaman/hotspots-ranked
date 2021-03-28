export interface IProcessEnv {
  DEPOSIT_MAX?: string;
  LOAN_PCTG_MAX?: string;
  ANNUAL_PCTG_RATE?: string;
  YEARS?: string;
  AREAS?: string;
  BEDROOMS_MIN?: string;
  BEDROOMS_MAX?: string;
  SALES_URL?: string;
  SALES_RESULTS_SELECTOR?: string;
  SALES_DETAILS_SELECTOR?: string;
  SALES_DETAILS_TITLE_SELECTOR?: string;
  SALES_DETAILS_PRICE_SELECTOR?: string;
  SALES_DETAILS_BEDROOMS_SELECTOR?: string;
  SALES_NEXT_LINK_SELECTOR?: string;
  LETTINGS_URL?: string;
  LETTINGS_RESULTS_SELECTOR?: string;
  LETTINGS_DETAILS_SELECTOR?: string;
  LETTINGS_DETAILS_TITLE_SELECTOR?: string;
  LETTINGS_DETAILS_BEDROOMS_SELECTOR?: string;
  LETTINGS_DETAILS_PRICE_SELECTOR?: string;
  LETTINGS_NEXT_LINK_SELECTOR?: string;
}

export interface IConfig {
  depositMax: number;
  loanPctgMax: number;
  annualInterestRate: number; // ANNUAL_PCTG_RATE
  monthlyInterestRate: number; // ANNUAL_PCTG_RATE / 12
  months: number; // TERM x 12
  areas: string[];
  bedRoomsMin: number;
  bedRoomsMax: number;
  sales: IScrapeSettings;
  lettings: IScrapeSettings;
}

export interface IScrapeSettings {
  url: string;
  resultsSelector: string;
  detailsSelector: string;
  detailsTitleSelector: string;
  detailsPriceSelector: string;
  detailsBedRoomsSelector: string;
  nextLinkSelector: string;
}

export interface IFindHousesBaseInput {
  area: string;
  priceMin?: number;
  priceMax?: number;
  bedRoomsMin?: number;
  bedRoomsMax?: number;
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
