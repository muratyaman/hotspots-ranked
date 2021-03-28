import puppeteer, { Page } from 'puppeteer';
import { sleep } from './utils';

export interface IScrapeInput {
  url: string;
  readyWhenElementExists: string;
  sleepMs: number;
}

export interface IProcessPageFunc {
  (page: Page): Promise<boolean>;
}

export function browse(input: IScrapeInput, processPage: IProcessPageFunc): Promise<void> {
  let { url, readyWhenElementExists } = input;
  return new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(url);
      let stop = false;
      while (!stop) {
        await page.waitForSelector(readyWhenElementExists, { timeout: 10000 });
        stop = await processPage(page);
        await sleep(input.sleepMs);
      }
      browser.close();
      return resolve();
    } catch (e) {
      return reject(e);
    }
  });
}
