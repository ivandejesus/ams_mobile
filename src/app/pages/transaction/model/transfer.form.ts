import { TransactionForm, TransactionFormPayload } from "./transaction.form";
import { FormBuilder } from "@angular/forms";

export interface TransferFormPayload extends TransactionFormPayload {
  transfer: {
    from: number,
    to: {
      [s: number]: {
        amount: string,
        product: string,
        username?: string,
      }
    },
    transactionPassword?: string,
  }
}

export abstract class TransferForm extends TransactionForm {
  constructor() {
    super();
  }

  abstract buildForm(formBuilder: FormBuilder): void;
  abstract createPayload() : any;
}
