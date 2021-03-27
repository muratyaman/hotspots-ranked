import { formatMoney } from './i18n';
import { IHouseForSale, IHouseToLet } from './types';

const defMax = 123456;

export function randPrice(max = defMax, min = 0): string {
  return randMoney(max, min);
}

export function randMoney(max = defMax, min = 0): string {
  return formatMoney(randNum(max, min));
}

export function randNum(max = defMax, min = 0): number {
  return min + Math.random() * (max - min);
}

export function randInt(max = defMax, min = 0): number {
  const range = max - min;
  return min + Math.floor(Math.random() * Math.floor(range));
}

export function randHouseForSale(i: number): IHouseForSale {
  const h = {
    id: (new Date()).toISOString(),
    title: `house for sale ${1 + i}`,
    price: randPrice(150000, 50000),
    bedRooms: randInt(3, 2),
  };
  console.log(' >> ', h);
  return h;
}

export function randHouseToLet(i: number): IHouseToLet {
  const h = {
    id: (new Date()).toISOString(),
    title: `house to let ${1 + i}`,
    price: randPrice(1500, 500),
    bedRooms: randInt(3, 2),
  };
  console.log(' >> ', h);
  return h;
}
