import { CustomerPaymentOption } from "../../../../../../shared/model/customer-payment-option.model";
import { FormBuilder, Validators, FormArray } from "@angular/forms";
import { DepositForm } from "../../../../model/deposit.form";
import { multiply, inBetween, zero, add } from "../../../../../../shared/decimal.util";
import Decimal from "decimal.js";


export class BankDepositForm extends DepositForm {
  constructor(
    formBuilder: FormBuilder,
    customerPaymentOption: CustomerPaymentOption) {

    super(customerPaymentOption);
    this.buildForm(formBuilder);
  }

  buildForm(formBuilder: FormBuilder) {
    this.transaction = formBuilder.group({
      file: [null],
      subtransactions: formBuilder.array([
        formBuilder.group({
          amount: ['', Validators.required],
          product: ['', Validators.required],
        })
      ])
    });
  }

  get fee(): Decimal {
    let fee = new Decimal(zero());
    
    if (inBetween(this.totalAmount, 1, 200)) {
      fee = multiply(this.totalAmount, new Decimal(0.01));
    }

    if (inBetween(this.totalAmount, 201, 1999)) {
      fee = new Decimal(15);
    }

    return fee;
  }

  createPayload(): FormData {
    const formData = new FormData();

    formData.append('transaction[email]', '');
    formData.append('transaction[paymentOptionType]', this.customerPaymentOption.type);
    formData.append('transaction[paymentOption]', this.customerPaymentOption.id.toString());
    formData.append('transaction[customerFee]', this.fee.toFixed(2));

    let index = 0;
    this.getSubtransactions().value.forEach((subTransaction) => {
      formData.append('transaction[subTransactions][' + index + '][product]', subTransaction.product);
      formData.append('transaction[subTransactions][' + index + '][amount]', subTransaction.amount);

      index++;
    });

    if (this.transaction.get('file').value) {
      formData.append('transaction[file]', this.transaction.get('file').value);
    }

    return formData;
  }
}
