const i18nMoney = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });
const i18nDec   = new Intl.NumberFormat('en-GB', { style: 'decimal', maximumSignificantDigits: 3 });
const i18nPctg  = new Intl.NumberFormat('en-GB', { style: 'percent', maximumSignificantDigits: 2 });

export function convertMoney(val: string): number {
  return Number.parseFloat(val.replace('£', '').replace(/,/g, ''));
}

export function formatMoney(val: number): string {
  return i18nMoney.format(val);
}

export function formatDec(val: number): string {
  return i18nDec.format(val);
}

export function formatPctg(val: number): string {
  return i18nPctg.format(val);
}
