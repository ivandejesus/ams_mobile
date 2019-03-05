import { TransactionForm, TransactionFormPayload } from "./transaction.form";
import { CustomerPaymentOption } from "../../../shared/model/customer-payment-option.model";
import { FormBuilder, FormArray, FormGroup, FormControl } from "@angular/forms";

import{ get } from "lodash";
import { BitcoinWithdrawalPayload } from "../tabs/withdrawal/forms/bitcoin/btc-withdrawal.form";
import { subtract, multiply } from "../../../shared/decimal.util";
import Decimal from "decimal.js";

export interface WithdrawalFormPayload extends TransactionFormPayload {
  /**
   * Override transaction payload definition
   */
  transaction: {
    transactionPassword: string;
    paymentOption: number;
    customerFee: string;
    subTransactions: {
      [index: number]: {
        amount: string, 
        product: string,
        forFee: string,
      }
    };
  }
}

export abstract class WithdrawalForm extends TransactionForm {
  static TYPE = 'withdrawal';

  constructor(public customerPaymentOption: CustomerPaymentOption) {
    super();
  }

  addSubtransaction(): void {
    const subtransactions = <FormArray>this.transaction.get('subtransactions');
    const forFee: boolean = subtransactions.length === 0;
        
    const formGroup = new FormGroup({
      amount: new FormControl(''),
      product: new FormControl(''),
      forFee: new FormControl(forFee)
    });

    subtransactions.push(formGroup);
  }

  removeSubtransaction(index: number): void {
    const subtransactions = <FormArray> this.getSubtransactions();
    const formGroup = subtransactions.at(index);
    
    // Remove only subtransactions without fee
    if (!formGroup.get('forFee').value) {
      subtransactions.removeAt(index);
    }
  }

  setErrors(formErrors: any): void {
    const subtransactionErrors = get(formErrors, 'children.subTransactions.children');
  
    let index = 0;
    for (const error of subtransactionErrors) {
      this.getSubtransactions().at(index).get('amount').setErrors({'formError': error.children.amount.errors});
      this.getSubtransactions().at(index).get('product').setErrors({'formError': error.children.product.errors});
      index++;
    }

    const transactionPasswordErrors = get(formErrors,'children.transactionPassword.errors');
    this.transaction.get('transactionPassword').setErrors({'formError': transactionPasswordErrors});
  }

  get totalAmountToBeWithdrawn(): Decimal {
    return subtract(this.totalAmount, this.fee);
  }

  get fee(): Decimal {
    const feeMultipler = this.customerPaymentOption.fee(WithdrawalForm.TYPE);
    
    return multiply(this.totalAmount, feeMultipler);
  }

  checkChargeFee(index: number): void {
    for (const control of this.getSubtransactions().controls) {
      if (control instanceof FormGroup) {
        control.patchValue({forFee: false});
      }
    }

    this.getSubtransactions().at(index).patchValue({forFee: true});
  }

  reset(): void {
    super.reset();
    this.transaction.get('transactionPassword').setValue('');
  }

  abstract buildForm(formBuilder: FormBuilder): void;
  abstract createPayload(param?: any) : WithdrawalFormPayload | BitcoinWithdrawalPayload;
}
