import fse from 'fs-extra';
import path from 'path';
import { Page } from 'puppeteer';
import { browse } from './browse';
import { IConfig, IFindHousesForSaleInput, IHouseForSale } from './types';

const patternResults = /(\d+) results/;

export async function findHousesForSale(config: IConfig, input: IFindHousesForSaleInput): Promise<IHouseForSale[]> {
  const houses: IHouseForSale[] = [];
  const { area, priceMin, priceMax, bedRoomsMin, bedRoomsMax } = input;
  let {
    url,
    resultsSelector: readyWhenElementExists,
    detailsSelector,
    detailsTitleSelector,
    detailsPriceSelector,
    detailsBedRoomsSelector,
  } = config.sales;

  url = url
    .replace(/AREA/, area)
    .replace(/PRICE_MIN/, String(priceMin ?? 1))
    .replace(/PRICE_MAX/, String(priceMax ?? 1234567))
    .replace(/BEDROOMS_MIN/, String(bedRoomsMin ?? 3))
    .replace(/BEDROOMS_MAX/, String(bedRoomsMax ?? 3))
  ;

  let pageId = 1, pageSize = 25;

  await browse({ url, readyWhenElementExists, sleepMs: 1000}, async (page: Page) => {
    const html = await page.content();
	  fse.writeFileSync(makeFilePath(area, pageId), html);

    const resultsEl = await page.$(readyWhenElementExists);
    
    if (resultsEl) {
      let resultsText = await resultsEl.evaluate(el => el.textContent);
      console.log(area, 'houses for sale in' , resultsText);
      resultsEl.dispose();

      const resultsMatch = String(resultsText).match(patternResults);
      const totalHouseCount = resultsMatch ? resultsMatch[1] : 0;

      // process list of house details
      const houseElArr = await page.$$(detailsSelector);
      for (let houseEl of houseElArr) {
        let id = '';
        const titleRaw = await houseEl.$eval(detailsTitleSelector, el => el.textContent);
        const priceRaw = await houseEl.$eval(detailsPriceSelector, el => el.textContent);
        const bedRoomsRaw = await houseEl.$eval(detailsBedRoomsSelector, el => el.textContent);
        houses.push({
          id,
          title: titleRaw ?? 'title',
          price: priceRaw ?? '0',
          bedRooms: Number.parseInt(bedRoomsRaw ?? '0'),
        });
      }

    } else {
      console.log('results element [not found]');
    }

    // TODO: decide when to stop: if (totalHouseCount < pageSize * pageId || pageId === 4) stop = true; // get 100 records
    pageId++;
    return true; // stop
  });

  return houses;
}

function makeFilePath(area: string, pageId: number) {
  return path.resolve(__dirname, '..', 'logs', 'sales', `${area}--page-${pageId}.html`);
}
