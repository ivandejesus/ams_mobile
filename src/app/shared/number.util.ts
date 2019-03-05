import { Decimal as Dec } from "decimal.js" // As Dec becoz we wanna use Decimal word :)

/**
 * A wrapper class for Decimal.js 
 * 
 * Functions on this class directly mutate its state
 * e.g plus() and mul() mutates _value property.
 * 
 * TODO: Do not mutate, I repeat, do not mutate.
 */
export class Decimal {
  private _value: Dec;

  private decimalPlaces: number;
  
  constructor(value: string | number | Decimal, decimalPlaces: number = 2) {
    this.decimalPlaces = decimalPlaces;

    if (value instanceof Decimal) {
      value = value.getValue().valueOf();
    }

    if (value === '') {
      value = ZERO;
    }

    if (value === 'FREE') {
      value = ZERO;
    }


    this._value = new Dec(value);
  }

  format(number: number, decimalPlaces: number = 2, wholePart: number = 3, sectionsDelimeter: string = ',', decimalDelimeter: string = '.') {
    const re = '\\d(?=(\\d{' + (wholePart || 3) + '})+' + (decimalPlaces > 0 ? '\\D' : '$') + ')',
    num = number.toFixed(Math.max(0, ~~decimalPlaces));

    return (decimalDelimeter ? num.replace('.', decimalDelimeter) : num).replace(new RegExp(re, 'g'), '$&' + (sectionsDelimeter || ','));
  }

  plus(decimal: Decimal): Decimal {
    let newValue = new Dec(this._value.plus(decimal.valueOf()));

    this._value = newValue;

    return this;
  }

  sub(decimal: Decimal): Decimal {
    let newValue = new Dec(this._value.sub(decimal.valueOf()));

    this._value = newValue;

    return this;
  }

  mul(decimal: Decimal): Decimal {
    let newValue = new Dec(this._value.mul(decimal.valueOf()));

    this._value = newValue;

    return this;
  }

  div(decimal: Decimal): Decimal {
    let newValue = new Dec(this._value.div(decimal.valueOf()));

    this._value = newValue;

    return this;
  }

  getValue(): Dec {
    return this._value;
  }

  valueOf(): number {
    return +this._value.valueOf();
  }

  toFixed(decimalPlaces: number): string {
    return this._value.toFixed(decimalPlaces);
  }

  static isNaN(value: string): boolean {
    return isNaN(+value);
  }

  toString(): string {
    const formatted = new Dec(this._value.toFixed(this.decimalPlaces));

    return addComma(formatted.toSignificantDigits().valueOf(), this.decimalPlaces);
  }
}

export const addComma = (number: string, decimalPlaces: number): string => {
  return number.replace(/\B(?=(\d{decimalPlaces})+(?!\d))/g, ",");
}

export const inBetween = (value: Decimal, start: Decimal, end: Decimal): boolean => {
  return value.valueOf() >= start.valueOf() && value.valueOf() <= end.valueOf();
}

export const ZERO = '0';
export const BITCOIN_DECIMAL_PLACES: number = 5;
