import { CustomerProduct } from "./customer-products.model";
import { Currency } from "./currency.model";
import Decimal from "decimal.js";
import { zero, add } from "../decimal.util";

export interface CustomerBalanceResponse {
  unallocated: number;
}

// TODO: Should be done on the api.
export function getAllocatedBalance(customerProducts: CustomerProduct[]): Decimal {
  let allocatedBalance = zero();

  for (const customerProduct of customerProducts ) {
    allocatedBalance = add(allocatedBalance, customerProduct.balance);
  }

  return allocatedBalance;
}

export class CustomerBalance {
  allocated: Decimal;
  unallocated: Decimal;
  currency: Currency;

  constructor(allocated: Decimal, unallocated: Decimal, currency: Currency) {
    this.allocated = allocated;
    this.unallocated = unallocated;
    this.currency = currency;
  }

  get allocatedWithCurrency(): string {
    return this.allocated.toString() + ' ' + this.currency.code;
  }

  get unallocatedWithCurrency(): string {
    return this.unallocated.toString() + ' ' + this.currency.code;
  }
}
