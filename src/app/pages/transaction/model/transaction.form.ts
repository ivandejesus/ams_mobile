import { FormGroup, FormBuilder, FormArray, FormControl } from "@angular/forms";
import{ get } from "lodash";
import Decimal from "decimal.js";
import { zero, isValidDecimal, add } from "../../../shared/decimal.util";

export interface TransactionFormPayload {
  [index: string]: any;
}

export abstract class TransactionForm {
  formBuilder: FormBuilder;

  transaction: FormGroup;
  isSubmitting: boolean = false;
  isReadOnly: boolean = false;

  constructor() {
  }

  /**
   * Override for more complex logic
   */
  addSubtransaction(): void {
    const subtransactions = <FormArray>this.transaction.get('subtransactions');
    
    const formGroup = new FormGroup({
      amount: new FormControl(''),
      product: new FormControl('')
    });

    subtransactions.push(formGroup);
  }

  removeSubtransaction(index: number): void {
    const subtransactions = this.getSubtransactions();
    subtransactions.removeAt(index);
  }

  canRemoveSubtransaction(): boolean {
    const subtransactions = this.getSubtransactions();

    return subtransactions.length > 1;
  }

  getSubtransactions(): FormArray {
    return <FormArray>this.transaction.get('subtransactions');
  }

  getSubtransaction(index: number): FormGroup {
    return <FormGroup>this.getSubtransactions().at(index);
  }

  setErrors(formErrors: any): void  {    
    const emailErrors = get(formErrors, 'children.email.errors');
    this.transaction.get('email').setErrors({'formError': emailErrors});

    const subtransactionErrors = get(formErrors, 'children.subTransactions.children');
    let index = 0;
    for (const error of subtransactionErrors) {
      this.getSubtransactions().at(index).get('amount').setErrors({'formError': error.children.amount.errors});
      this.getSubtransactions().at(index).get('product').setErrors({'formError': error.children.product.errors});
      index++;
    }
  }

  reset(): void {
    const subtransactions = <FormArray>this.transaction.get('subtransactions');

    // Clear FormArray without removing subscriptions.
    while (subtransactions.length !== 0) {
      subtransactions.removeAt(0);
    }

    this.addSubtransaction();
  }

  get totalAmount(): Decimal {
    const subtransactions = this.getSubtransactions();

    const total = subtransactions.value.reduce((accumulator: Decimal, newValue: any): Decimal => {
      return isValidDecimal(newValue.amount) ? add(accumulator, new Decimal(newValue.amount)) : accumulator; 
    }, new Decimal(0));

    return total;
  }

  /**
   * Override for more complicated logic.
   */
  get totalAmountToBeSent(): Decimal {
    return new Decimal(zero());
  }
}
