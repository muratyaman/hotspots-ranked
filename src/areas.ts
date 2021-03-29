import fse from 'fs-extra';
import path from 'path';
import { IConfig } from './types';

export async function findAreas(config: IConfig): Promise<string[]> {
  const file = path.resolve(config.areasFile);
  const list = fse.readFileSync(file).toString();
  const areas = list.split('\n').filter(l => l.trim() !== '');
  return areas ?? [];
}
