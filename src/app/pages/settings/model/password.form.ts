import { FormGroup, FormBuilder } from "@angular/forms";

export interface PasswordFormPayload {

}

export abstract class PasswordForm {
  formBuilder: FormBuilder;

  security: FormGroup;
  isSubmitting: boolean = false;
  isReadOnly: boolean = false;

  constructor() {
  }

  abstract buildForm(formBuilder: FormBuilder): void;
  abstract createPayload() : any;
  abstract setErrors(formErrors: any): void;

  reset(): void {
    this.security.reset();
  }
}
