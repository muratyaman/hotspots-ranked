// import fse from 'fs-extra';
// import path from 'path';
import { Page } from 'puppeteer';
import { browse, IBrowseInput } from './browse';
import { convertMoney } from './i18n';
import { randHouseToLet, randInt } from './mocks';
import { IConfig, IFindHousesToLetInput, IHouseToLet } from './types';
// import { ts } from './utils';

const patternResults = /(\d+) results/;
const patternLink = /\/to-rent\/details\/(\d+)\//;

export async function findHousesToLet(config: IConfig, input: IFindHousesToLetInput, mocks = false): Promise<IHouseToLet[]> {

  if (mocks) return Array.from({ length: randInt(100, 20) }).map((_, i) => randHouseToLet(i));

  const houses: IHouseToLet[] = [];
  const { area, priceMin, priceMax, bedRoomsMin, bedRoomsMax } = input;
  let { baseUrl } = config;
  let {
    urlPath,
    resultsSelector: readyWhenElementExists,
    detailsSelector,
    detailsLinkSelector,
    detailsTitleSelector,
    detailsPriceSelector,
    detailsBedRoomsSelector,
  } = config.lettings;

  const url = baseUrl + urlPath
    .replace(/AREA/g, area.toLowerCase())
    .replace(/PRICE_MIN/g, String(priceMin ?? 1))
    .replace(/PRICE_MAX/g, String(priceMax ?? 1234567))
    .replace(/BEDROOMS_MIN/g, String(bedRoomsMin ?? 3))
    .replace(/BEDROOMS_MAX/g, String(bedRoomsMax ?? 3))
  ;

  let pageId = 1, pageSize = 25;

  const browseInput: IBrowseInput = { url, readyWhenElementExists, sleepMs: 1000 };
  if (config.httpProxy) browseInput.httpProxy = config.httpProxy;

  try {
    await browse(config, browseInput, async (page: Page) => {
      console.log(' > processing lettings page...');
      try {
        // TODO: save HTML copy ?
        // const html = await page.content();
        // fse.writeFileSync(makeFilePath(area, pageId), html);

        let resultsText = await page.$eval(readyWhenElementExists, el => el.textContent);
        if (resultsText !== '') {
          const resultsMatch = String(resultsText).match(patternResults);
          const totalHouseCount = resultsMatch ? resultsMatch[1] : 0;

          // process list of house details
          const houseElArr = await page.$$(detailsSelector);
          for (let houseEl of houseElArr) {
            const linkRaw = await houseEl.$eval(detailsLinkSelector, el => el.getAttribute('href'));
            const linkMatch = String(linkRaw).match(patternLink);
            const id = linkMatch ? linkMatch[1]  : '';
            
            const titleRaw    = await houseEl.$eval(detailsTitleSelector, el => el.textContent);
            const priceRaw    = await houseEl.$eval(detailsPriceSelector, el => el.textContent);
            const bedRoomsRaw = await houseEl.$eval(detailsBedRoomsSelector, el => el.textContent);
            // TODO: address line

            const price = priceRaw ? convertMoney(priceRaw) : 0;
            console.log(' + found house id', id, 'price', priceRaw, 'title', titleRaw);
            if (price > 0) {
              houses.push({
                id,
                title: titleRaw ?? 'title',
                price: priceRaw ?? '0',
                bedRooms: Number.parseInt(bedRoomsRaw ?? '0'),
                ts: new Date(),
              });
            }
          }

        } else {
          console.log(' -- results element [not found]');
        }
      } catch (err) {
        console.error(' > processing page... ERROR', err.message);
      }

      // TODO: decide when to stop: if (totalHouseCount < pageSize * pageId || pageId === 4) stop = true; // get 100 records
      pageId++;
      return true; // stop
    });

  } catch (err) {
    console.error('findHousesToLet() ERROR', err.message);
  }

  return houses;
}

// function makeFilePath(area: string, pageId: number) {
//   const t = ts();
//   return path.resolve(__dirname, '..', 'logs', 'lettings', `${area}--page-${pageId}--${t}.html`);
// }
