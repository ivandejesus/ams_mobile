import { WithdrawalForm, WithdrawalFormPayload } from "../../../../model/withdrawal.form";
import { FormBuilder, Validators } from "@angular/forms";
import { CustomerPaymentOption } from "../../../../../../shared/model/customer-payment-option.model";

export class EcopayzForm extends WithdrawalForm {
  constructor(
    formBuilder: FormBuilder,
    customerPaymentOption: CustomerPaymentOption) {

    super(customerPaymentOption);
    this.buildForm(formBuilder);
  }

  buildForm(formBuilder: FormBuilder): void {
    this.transaction = formBuilder.group({
      transactionPassword: ['', Validators.required],
      subtransactions: formBuilder.array([ 
        formBuilder.group({
          amount: ['', Validators.required],
          product: ['', Validators.required],
          forFee: [true]
        })
      ])
    });
  }

  createPayload(): WithdrawalFormPayload {
    const payload = {
      transaction: {
        transactionPassword: this.transaction.get('transactionPassword').value,
        paymentOption: this.customerPaymentOption.id,
        paymentOptionType: this.customerPaymentOption.type,
        customerFee: this.fee.toFixed(2),
        subTransactions: {},
      }
    }

    const subtransactions = {};
    let index = 0;

    for (const subtransaction of this.getSubtransactions().value) {
      subtransactions[index++] = {
        product: subtransaction.product,
        amount: subtransaction.amount,
        forFee: +subtransaction.forFee
      }
    }

    payload.transaction.subTransactions = subtransactions;

    return payload;
  }
}
