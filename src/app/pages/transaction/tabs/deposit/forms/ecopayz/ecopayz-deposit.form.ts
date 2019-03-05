import { CustomerPaymentOption } from "../../../../../../shared/model/customer-payment-option.model";
import { FormBuilder, Validators } from "@angular/forms";
import { DepositForm, DepositFormPayload } from "../../../../model/deposit.form";
import { environment } from "../../../../../../../environments/environment";

export interface EcopayzDepositFormPayload extends DepositFormPayload {
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
  };
  returnUrl: string;
  failureUrl: string;
  cancelUrl: string;
}

export class EcopayzDepositForm extends DepositForm {
  constructor(
    formBuilder: FormBuilder,
    customerPaymentOption: CustomerPaymentOption) {

    super(customerPaymentOption);
    this.buildForm(formBuilder);
  }

  buildForm(formBuilder: FormBuilder) {
    this.transaction = formBuilder.group({
      email: [this.customerPaymentOption.accountId, Validators.required],
      subtransactions: formBuilder.array([
        formBuilder.group({
          amount: ['', Validators.required],
          product: ['', Validators.required],
        })
      ])
    });
  }

  createPayload(): EcopayzDepositFormPayload {
    const payload = {
      transaction: {
        email: this.transaction.get('email').value,
        paymentOptionType: this.customerPaymentOption.type,
        paymentOption: this.customerPaymentOption.id,
        customerFee: this.fee.toFixed(2),
        subTransactions: {},
      },
      returnUrl: environment.ecopayzSuccessUrl,
      failureUrl: environment.ecopayzFailureUrl,
      cancelUrl: environment.ecopayzCancelUrl
    }

    let index = 0;
    const subTransactions = [];

    for (const subtransaction of this.getSubtransactions().value) {
      subTransactions[index++] = {
        product: subtransaction.product,
        amount: subtransaction.amount,
      }
    }

    payload.transaction.subTransactions = subTransactions;

    return payload;
  }
}
