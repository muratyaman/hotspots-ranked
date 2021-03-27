import { IConfig } from './types';

export async function findAreas(config: IConfig) {
  return config.areas;
}
