import puppeteer, { Page, PuppeteerNodeLaunchOptions } from 'puppeteer';
import { IConfig } from './types';
import { sleep } from './utils';

const userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36';

export interface IBrowseInput {
  url1: string;
  url2: string;
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
      let { url1, url2, readyWhenElementExists, httpProxy } = input;
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
      
      //console.log('browse() going to url1', url1);
      //await page.goto(url1, { waitUntil: 'domcontentloaded', timeout: 5000 });
      //console.log('browse() going to url1', url1, 'done!');
      //await sleep(5000);

      //console.log('browse() cookie button', cookieConsentButtonSelector);
      // const btnEl = await page.$(cookieConsentButtonSelector);
      // if (btnEl) {
      //   console.log('browse() cookie button', cookieConsentButtonSelector, 'found!');
      //   console.log('browse() accepting cookies ...');
      //   await page.click(cookieConsentButtonSelector);
      //   console.log('browse() accepting cookies ... done!');
      // }

      console.log('browse() going to url2', url2);
      await page.goto(url2, { waitUntil: 'domcontentloaded', timeout: 5000 });
      console.log('browse() going to url2', url2, 'done!');
      //await sleep(5000);

      let stop = false, pageId = 1;
      while (!stop && pageId <= 10) {
        await page.waitForSelector(readyWhenElementExists, { timeout: 10000 });
        stop = await processPage(page);
        pageId++;
        await sleep(input.sleepMs);
      }

      //await sleep(5000);

      browser.close();
      return resolve();
    } catch (err) {
      console.error('browse() ERROR', err.message);
      return reject(err);
    }
  });
}
