import Decimal from "decimal.js";

export function zero(): Decimal {
  return new Decimal('0.00');
}

export function add(x: Decimal, y: Decimal): Decimal {
  return x.plus(y);
}

export function subtract(x: Decimal, y: Decimal): Decimal {
  return x.sub(y);
}

export function multiply(x: Decimal, y: Decimal): Decimal {
  return x.mul(y);
}

export const inBetween = (value: Decimal, start: Decimal | string | number, end: Decimal | string | number): boolean => {
  if (typeof start === 'string' || typeof start === 'number') {
    start = new Decimal(start);
  }

  if (typeof end === 'string' || typeof end === 'number') {
    end = new Decimal(end);
  }
  
  return value.greaterThanOrEqualTo(start) && value.lessThanOrEqualTo(end);
}

export function format(x: Decimal, decimalPlaces: number = 2, shouldAddComma: boolean = true): string {
  let formatted = x.toFixed(decimalPlaces);

  if (shouldAddComma) {
    formatted = addComma(formatted);
  }

  return formatted;
}

export function isValidDecimal(x: string): boolean {
  try {
    const decimal = new Decimal(x);
  } catch (e) {
    return false;
  }

  return true;
}

export function addComma(number: string): string {
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}