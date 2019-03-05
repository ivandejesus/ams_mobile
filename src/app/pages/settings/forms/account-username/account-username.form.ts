import { FormBuilder, Validators } from "@angular/forms";
import { get } from "lodash";
import { PasswordForm, PasswordFormPayload } from "../../model/password.form";

export interface AccountUsernameFormPayload extends PasswordFormPayload {
  security: {
    currentPassword: string,
    hasChangeUsername: boolean,
    username: {
      first: string,
      second: string,
    }
  }
}

export class AccountUsernameForm extends PasswordForm {
  constructor(formBuilder: FormBuilder) {

    super();
    this.buildForm(formBuilder);
  }

  buildForm(formBuilder: FormBuilder): void {
    this.security = formBuilder.group({
      currentPassword: ['', Validators.required],
      newUsername: ['', Validators.required],
      confirmUsername: ['', Validators.required],
    });
  }

  createPayload(): AccountUsernameFormPayload {
    const payload = {
      security: {
        currentPassword: this.security.get('currentPassword').value,
        hasChangeUsername: true,
        username: {
          first: this.security.get('newUsername').value,
          second: this.security.get('confirmUsername').value,
        }
      }
    }

    return payload;
  }

  setErrors(formErrors: any): void  {
    this.security.setErrors({ 'formError': get(formErrors, 'errors') });
    this.security.get('currentPassword').setErrors({ 'formError': get(formErrors, 'children.currentPassword.errors') });
    this.security.get('newUsername').setErrors({ 'formError': get(formErrors, 'children.username.children.first.errors') });
    this.security.get('confirmUsername').setErrors({ 'formError': get(formErrors, 'children.username.children.second.errors') });
  }
}
