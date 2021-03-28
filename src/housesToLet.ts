import { randHouseToLet, randInt } from './mocks';
import { IConfig, IFindHousesToLetInput, IHouseToLet } from './types';

export async function findHousesToLet(config: IConfig, input: IFindHousesToLetInput): Promise<IHouseToLet[]> {

  // TODO: search
  return Array.from({ length: randInt(10, 5) }).map((_, i) => randHouseToLet(i));

}
