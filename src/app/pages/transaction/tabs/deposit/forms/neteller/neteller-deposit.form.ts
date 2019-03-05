import { CustomerPaymentOption } from "../../../../../../shared/model/customer-payment-option.model";
import { FormBuilder, Validators, FormArray } from "@angular/forms";
import { DepositForm, DepositFormPayload } from "../../../../model/deposit.form";

export class NetellerDepositForm extends DepositForm {
  constructor(
    formBuilder: FormBuilder,
    customerPaymentOption: CustomerPaymentOption) {

    super(customerPaymentOption);
    this.buildForm(formBuilder);
  }

  buildForm(formBuilder: FormBuilder) {
    this.transaction = formBuilder.group({
      email: [this.customerPaymentOption.email, Validators.required],
      subtransactions: formBuilder.array([
        formBuilder.group({
          amount: ['', Validators.required],
          product: ['', Validators.required],
        })
      ])
    });
  }

  createPayload(): DepositFormPayload {
    const payload = {
      transaction: {
        email: this.transaction.get('email').value,
        paymentOptionType: this.customerPaymentOption.type,
        paymentOption: this.customerPaymentOption.id,
        customerFee: this.customerPaymentOption.fee(DepositForm.TYPE).toString(),
        subTransactions: {},
      }
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
