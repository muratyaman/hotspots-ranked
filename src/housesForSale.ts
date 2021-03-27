import { randHouseForSale, randInt } from './mocks';
import { IFindHousesForSaleInput, IHouseForSale } from './types';

export async function findHousesForSale(input: IFindHousesForSaleInput): Promise<IHouseForSale[]> {

  // TODO: search
  return Array.from({ length: randInt(10, 5) }).map((_, i) => randHouseForSale(i));

}
