const i18nMoney = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });
const i18nPctg = new Intl.NumberFormat('en-GB', { maximumSignificantDigits: 1 });

export function formatMoney(val: number): string {
  return i18nMoney.format(val);
}

export function convertMoney(val: string): number {
  return Number.parseFloat(val.replace('£', '').replace(/,/g, ''));
}

export function formatPctg(val: number): string {
  return i18nPctg.format(val) + '%';
}
