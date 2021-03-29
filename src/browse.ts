import puppeteer, { Page, PuppeteerNodeLaunchOptions } from 'puppeteer';
import { IConfig } from './types';
import { sleep } from './utils';

const userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36';

export interface IBrowseInput {
  url: string;
  readyWhenElementExists: string;
  sleepMs: number;
  httpProxy?: string;
}

export interface IProcessPageFunc {
  (page: Page): Promise<boolean>;
}

export function browse(config: IConfig, input: IBrowseInput, processPage: IProcessPageFunc): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const { cookieConsentButtonSelector } = config;
      let { url, readyWhenElementExists, httpProxy } = input;
      const width = 1000, height = 800;
      const options: PuppeteerNodeLaunchOptions = {
        ignoreHTTPSErrors: true,
        headless: true,
      };
      if (httpProxy) {
        options.args = [`--proxy-server=${httpProxy}`];
      }
      const browser = await puppeteer.launch(options);
      
      const page = await browser.newPage();
      await page.setUserAgent(userAgent);
      await page.setViewport({ width, height });

      page.setDefaultNavigationTimeout(10000); // 10s

      console.log();
      console.log('browse() going to url', url);
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 5000 });
      console.log('browse() going to url done!');
      console.log();

      let stop = false, pageId = 1;
      while (!stop && pageId <= 10) {
        await page.waitForSelector(readyWhenElementExists, { timeout: 10000 });
        stop = await processPage(page);
        pageId++;
        await sleep(input.sleepMs);
      }

      browser.close();
      return resolve();
    } catch (err) {
      console.error('browse() ERROR', err.message);
      return reject(err);
    }
  });
}
