import { FormBuilder, Validators } from "@angular/forms";
import { TransferForm, TransferFormPayload } from "../../../../model/transfer.form";
import { get } from "lodash";

export class ProductWalletForm extends TransferForm {
  constructor(formBuilder: FormBuilder) {

    super();
    this.buildForm(formBuilder);
  }

  buildForm(formBuilder: FormBuilder): void {
    this.transaction = formBuilder.group({
      fromProduct: ['', Validators.required],
      subtransactions: formBuilder.array([
        formBuilder.group({
          amount: ['', Validators.required],
          product: ['', Validators.required],
        })
      ])
    });
  }

  createPayload(): TransferFormPayload {
    const payload = {
      transfer: {
        from: this.transaction.get('fromProduct').value,
        to: {},
      }
    }

    const subTransactions = {};
    let index = 0;

    for (const subtransaction of this.getSubtransactions().value) {
      subTransactions[index++] = {
        product: subtransaction.product,
        amount: subtransaction.amount,
      }
    }

    payload.transfer.to = subTransactions;

    return payload;
  }

  setErrors(formErrors: any): void  {
    this.transaction.setErrors({ 'formError': get(formErrors, 'errors') });
    this.transaction.get('fromProduct').setErrors({ 'formError': get(formErrors, 'children.from.errors') });

    const subtransactionErrors = get(formErrors, 'children.to.children');

    let index = 0;
    for (const error of subtransactionErrors) {
      this.getSubtransactions().at(index).get('amount').setErrors({'formError': error.children.amount.errors });
      this.getSubtransactions().at(index).get('product').setErrors({'formError': error.children.product.errors });
      index++;
    }
  }
}
