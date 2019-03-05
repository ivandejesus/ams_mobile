import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { get } from "lodash";

export interface BankAccountFormPayload {
  memberPaymentOption: {
    memberPaymentOptionId?: number,
    is_active: number,
    is_default: number,
    is_withdrawal: number,
    account_id: string,
    account_name: string,
    birth_date: string,
    citizenship: string,
    account_address: string,
    swift_code: string,
    bank_name: string,
    bank_address: string,
    notes: string
  }
}

export class BankAccountForm {
  formBuilder: FormBuilder;
  bankAccount: FormGroup;

  isSubmitting: boolean = false;
  isReadOnly: boolean = false;

  constructor(formBuilder: FormBuilder) {
    this.buildForm(formBuilder);
  }

  buildForm(formBuilder: FormBuilder): void {
    this.bankAccount = formBuilder.group({
      accountNumber: ['', Validators.required],
      accountName: ['', Validators.required],
      swiftCode: ['', Validators.required],
      bankName: ['', Validators.required],
      bankAddress: ['', Validators.required],
      birthDate: ['', Validators.required],
      citizenship: ['', Validators.required],
      accountAddress: ['', Validators.required],
      isDefault: [''],
      saveBankAccount: [''],
    });
  }

  createPayload(hasSaveBankAccount: boolean, id?: number): BankAccountFormPayload {
    const payload = {
      memberPaymentOption: {
        is_active: 1,
        is_default: +this.bankAccount.get('isDefault').value,
        is_withdrawal: 1,
        account_id: this.bankAccount.get('accountNumber').value,
        account_name: this.bankAccount.get('accountName').value,
        birth_date: this.bankAccount.get('birthDate').value,
        citizenship: this.bankAccount.get('citizenship').value,
        account_address: this.bankAccount.get('accountAddress').value,
        swift_code: this.bankAccount.get('swiftCode').value,
        bank_name: this.bankAccount.get('bankName').value,
        bank_address: this.bankAccount.get('bankAddress').value,
        notes: '',
      }
    };

    if (id !== undefined) {
      payload['memberPaymentOption']['memberPaymentOptionId'] = id;
    }

    if (hasSaveBankAccount) {
      payload['memberPaymentOption']['is_active'] = +this.bankAccount.get('saveBankAccount').value;
    }

    return payload;
  }

  setErrors(formErrors: any): void  {
    this.bankAccount.setErrors({ 'formError': get(formErrors, 'errors') });
    this.bankAccount.get('accountNumber').setErrors({ 'formError': get(formErrors, 'children.account_id.errors') });
    this.bankAccount.get('accountName').setErrors({ 'formError': get(formErrors, 'children.account_name.errors') });
    this.bankAccount.get('swiftCode').setErrors({ 'formError': get(formErrors, 'children.swift_code.errors') });
    this.bankAccount.get('bankName').setErrors({ 'formError': get(formErrors, 'children.bank_name.errors') });
    this.bankAccount.get('bankAddress').setErrors({ 'formError': get(formErrors, 'children.bank_address.errors') });
    this.bankAccount.get('birthDate').setErrors({ 'formError': get(formErrors, 'children.birth_date.errors') });
    this.bankAccount.get('citizenship').setErrors({ 'formError': get(formErrors, 'children.citizenship.errors') });
    this.bankAccount.get('accountAddress').setErrors({ 'formError': get(formErrors, 'children.account_address.errors') });
  }

  reset(): void {
    this.bankAccount.reset();
  }
}
