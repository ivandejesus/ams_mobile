import { FormBuilder, Validators } from "@angular/forms";
import { PasswordForm, PasswordFormPayload } from "../../model/password.form";
import { get } from "lodash";

export interface TransactionPasswordFormPayload extends PasswordFormPayload {
  security: {
    currentTransactionPassword: string,
    hasChangeTransactionPassword: boolean,
    transactionPassword: {
      first: string,
      second: string,
    }
  }
}

export class TransactionPasswordForm extends PasswordForm {
  constructor(formBuilder: FormBuilder) {

    super();
    this.buildForm(formBuilder);
  }

  buildForm(formBuilder: FormBuilder): void {
    this.security = formBuilder.group({
      currentTransactionPassword: ['', Validators.required],
      newTransactionPassword: ['', Validators.required],
      confirmTransactionPassword: ['', Validators.required],
    });
  }

  createPayload(): TransactionPasswordFormPayload {
    const payload = {
      security: {
        currentTransactionPassword: this.security.get('currentTransactionPassword').value,
        hasChangeTransactionPassword: true,
        transactionPassword: {
          first: this.security.get('newTransactionPassword').value,
          second: this.security.get('confirmTransactionPassword').value,
        }
      }
    }

    return payload;
  }

  setErrors(formErrors: any): void  {
    this.security.setErrors({ 'formError': get(formErrors, 'errors') });
    this.security.get('currentTransactionPassword').setErrors({ 'formError': get(formErrors, 'children.currentTransactionPassword.errors') });
    this.security.get('newTransactionPassword').setErrors({ 'formError': get(formErrors, 'children.transactionPassword.children.first.errors') });
    this.security.get('confirmTransactionPassword').setErrors({ 'formError': get(formErrors, 'children.transactionPassword.children.second.errors') });
  }
}
