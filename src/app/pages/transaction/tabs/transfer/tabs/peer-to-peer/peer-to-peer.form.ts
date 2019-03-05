import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { TransferForm, TransferFormPayload } from "../../../../model/transfer.form";
import { get } from "lodash";

export class PeerToPeerForm extends TransferForm {
  constructor(formBuilder: FormBuilder) {

    super();
    this.buildForm(formBuilder);
  }

  buildForm(formBuilder: FormBuilder): void {
    this.transaction = formBuilder.group({
      fromProduct: ['', Validators.required],
      transactionPassword: ['', Validators.required],
      subtransactions: formBuilder.array([
        formBuilder.group({
          amount: ['', Validators.required],
          product: ['', Validators.required],
          username: ['', Validators.required],
        })
      ])
    });
  }

  createPayload(): TransferFormPayload {
    const payload = {
      transfer: {
        from: this.transaction.get('fromProduct').value,
        transactionPassword: this.transaction.get('transactionPassword').value,
        to: {},
      }
    }

    const subTransactions = {};
    let index = 0;

    for (const subtransaction of this.getSubtransactions().value) {
      subTransactions[index++] = {
        code: subtransaction.product,
        username: subtransaction.username,
        amount: subtransaction.amount,
      }
    }

    payload.transfer.to = subTransactions;

    return payload;
  }

  setErrors(formErrors: any): void  {
    this.transaction.setErrors({ 'formError': get(formErrors, 'errors') });
    this.transaction.get('transactionPassword').setErrors({ 'formError': get(formErrors, 'children.transactionPassword.errors') });
    this.transaction.get('fromProduct').setErrors({ 'formError': get(formErrors, 'children.from.errors') });

    const subtransactionErrors = get(formErrors, 'children.to.children');

    let index = 0;
    for (const error of subtransactionErrors) {
      this.getSubtransactions().at(index).get('amount').setErrors({'formError': error.children.amount.errors });
      this.getSubtransactions().at(index).get('product').setErrors({'formError': error.children.code.errors });
      this.getSubtransactions().at(index).get('username').setErrors({'formError': error.children.username.errors });
      index++;
    }
  }

  addSubtransaction(): void {
    const subtransactions = <FormArray>this.transaction.get('subtransactions');

    const formGroup = new FormGroup({
      amount: new FormControl(''),
      product: new FormControl(''),
      username: new FormControl('')
    });

    subtransactions.push(formGroup);
  }
}
