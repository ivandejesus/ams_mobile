import { FormBuilder, Validators } from "@angular/forms";
import { PasswordForm, PasswordFormPayload } from "../../model/password.form";
import { get } from "lodash";

export interface AccountPasswordFormPayload extends PasswordFormPayload {
  security: {
    currentPassword: string,
    hasChangePassword: boolean,
    password: {
      first: string,
      second: string,
    }
  }
}

export class AccountPasswordForm extends PasswordForm {
  constructor(formBuilder: FormBuilder) {

    super();
    this.buildForm(formBuilder);
  }

  buildForm(formBuilder: FormBuilder): void {
    this.security = formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  createPayload(): AccountPasswordFormPayload {
    const payload = {
      security: {
        currentPassword: this.security.get('currentPassword').value,
        hasChangePassword: true,
        password: {
          first: this.security.get('newPassword').value,
          second: this.security.get('confirmPassword').value,
        }
      }
    }

    return payload;
  }

  setErrors(formErrors: any): void  {
    this.security.setErrors({ 'formError': get(formErrors, 'errors') });
    this.security.get('currentPassword').setErrors({ 'formError': get(formErrors, 'children.currentPassword.errors') });
    this.security.get('newPassword').setErrors({ 'formError': get(formErrors, 'children.password.children.first.errors') });
    this.security.get('confirmPassword').setErrors({ 'formError': get(formErrors, 'children.password.children.second.errors') });
  }
}
