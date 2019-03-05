import { TransactionForm, TransactionFormPayload } from "./transaction.form";
import { CustomerPaymentOption } from "../../../shared/model/customer-payment-option.model";
import { FormBuilder } from "@angular/forms";
import Decimal from "decimal.js";
import { multiply, zero, add } from "../../../shared/decimal.util";

export interface DepositFormPayload extends TransactionFormPayload {
  /**
   * Override transaction payload definition
   */
  transaction: {
    email: string;
    paymentOptionType: string;
    paymentOption: number;
    customerFee: string;
    subTransactions: {
      [s: number]: {
        amount: string, 
        product: string,
        forFee: string,
      }
    };
  }
}

export abstract class DepositForm extends TransactionForm {
  static TYPE = 'deposit';

  constructor(public customerPaymentOption: CustomerPaymentOption) {
    super();
  }

  get totalAmountToBeSent(): Decimal {
    return add(this.totalAmount, this.fee);
  }

  get fee(): Decimal {
    const feeMultipler = this.customerPaymentOption.fee(DepositForm.TYPE);
    
    return multiply(this.totalAmount, feeMultipler);
  }

  abstract buildForm(formBuilder: FormBuilder): void;
  abstract createPayload(params?: any) : any;
}
