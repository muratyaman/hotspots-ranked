import { randHouseToLet, randInt } from './mocks';
import { IFindHousesToLetInput, IHouseToLet } from './types';

export async function findHousesToLet(input: IFindHousesToLetInput): Promise<IHouseToLet[]> {

  // TODO: search
  return Array.from({ length: randInt(10, 5) }).map((_, i) => randHouseToLet(i));

}
