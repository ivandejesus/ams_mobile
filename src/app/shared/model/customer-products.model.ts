import { fromNow } from "../date.util";
import { CurrencyResponse, Currency } from "./currency.model";
import { ProductResponse, Product } from "./product.model";
import Decimal from "decimal.js";

// The response format from the API
export interface CustomerProductResponse {
  id: number;
  username: string;
  balance: string;
  updated_at: string;
  currency: CurrencyResponse;
  product: ProductResponse;
}

export class CustomerProduct {
  id: number;
  username: string;
  balance: Decimal;
  lastUpdated: string;
  currency: Currency;
  product: Product;

  static fromResponse(response: CustomerProductResponse): CustomerProduct {
    const customerProduct = new CustomerProduct();

    customerProduct.id = response.id;
    customerProduct.username = response.username;
    customerProduct.balance = new Decimal(response.balance);
    customerProduct.lastUpdated = response.updated_at == null ? "" : fromNow(response.updated_at);
    customerProduct.currency = Currency.fromResponse(response.currency);
    customerProduct.product = Product.fromResponse(response.product);

    return customerProduct;
  }

  get currencyCode(): string {
    return this.currency.code;
  }

  get displayName(): string {
    return `${this.product.name} (${this.username})`;
  }
}
