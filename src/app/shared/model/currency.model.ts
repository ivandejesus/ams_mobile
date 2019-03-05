export interface CurrencyResponse {
  id: number;
  name: string;
  code: string;
}

export class Currency {
  id: number;
  name: string;
  code: string;

  static fromResponse(response: CurrencyResponse): Currency {
    const currency = new Currency();

    currency.id = response.id;
    currency.name = response.name;
    currency.code = response.code;

    return currency;
  }
}
