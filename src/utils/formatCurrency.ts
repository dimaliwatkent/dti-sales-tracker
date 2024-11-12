export function formatCurrency(
  number: number | string,
  symbol: string = "₱",
  decimalPlaces: number = 2,
): string {
  const num = typeof number === "string" ? parseFloat(number) : number;
  return `${symbol} ${num.toLocaleString(undefined, {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  })}`;
}
