import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TRANSACTION_TYPE, TRANSACTION_STATUS } from "../../shared/model/transaction.model";


export const TRANSACTION_HISTORY_TYPE_MAPPING = {
  '': 'All Types',
  1: TRANSACTION_TYPE.Deposit,
  2: TRANSACTION_TYPE.Withdraw,
  3: TRANSACTION_TYPE.Transfer,
  4: TRANSACTION_TYPE.Bonus,
  5: TRANSACTION_TYPE.P2P,
  7: TRANSACTION_TYPE.Commission,
  10: TRANSACTION_TYPE.Debit,
  11: TRANSACTION_TYPE.Credit
}

export const TRANSACTION_HISTORY_STATUS_MAPPING = {
  '': 'All Status',
  1: TRANSACTION_STATUS.Requested,
  2: TRANSACTION_STATUS.Processed,
  3: TRANSACTION_STATUS.Declined,
  4: TRANSACTION_STATUS.Acknowledged,
  'voided': TRANSACTION_STATUS.Voided,
  6: TRANSACTION_STATUS.Confirmed,
  7: TRANSACTION_STATUS.PendingConfirmation
}


export interface TransactioHistoryFilterFormPayload {
  from: Date;
  to: Date;
  types: string;
  paymentOption: string;
  status: string;
}

export class TransactionHistoryFilterForm {
  transactionHistoryForm: FormGroup;
  isSubmitting: boolean = false;
  
  constructor(formBuilder: FormBuilder) {
    this.buildForm(formBuilder);
  }

  buildForm(formBuilder: FormBuilder): void {
    this.transactionHistoryForm = formBuilder.group({
      dateFrom: '',
      dateTo:  '',
      type:  '',
      paymentOption:  '',
      status:  '',
    });
  }

  createPayload(): TransactioHistoryFilterFormPayload {
    const filter = {
      from: this.transactionHistoryForm.get('dateFrom').value,
      to: this.transactionHistoryForm.get('dateTo').value,
      types: this.transactionHistoryForm.get('type').value,
      paymentOption: this.transactionHistoryForm.get('paymentOption').value,
      status: this.transactionHistoryForm.get('status').value,
    }

    return filter;
  }

  resetFilter(formBuilder: FormBuilder): void {
    this.transactionHistoryForm.reset();
    this.transactionHistoryForm = formBuilder.group({
      dateFrom: '',
      dateTo: '',
      type: '',
      paymentOption: '',
      status: ''
    });
  }
  
}