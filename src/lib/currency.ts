export const CURRENCY_SYMBOL = "$";

export function withCurrencySymbol(value: number | string): string {
  return `${CURRENCY_SYMBOL}${value}`;
}

export function formatCurrencyNumber(
  value: number,
  locale: string = "en-US",
): string {
  return withCurrencySymbol(value.toLocaleString(locale));
}

export function formatCurrencyRange(
  min: number,
  max?: number | null,
  locale: string = "en-US",
): string {
  const minValue = formatCurrencyNumber(min, locale);
  if (max === null || max === undefined || min === max) {
    return minValue;
  }
  return `${minValue} - ${formatCurrencyNumber(max, locale)}`;
}

export function replaceCurrencySymbol(text: string): string {
  return text.replace(/\$/g, CURRENCY_SYMBOL);
}
