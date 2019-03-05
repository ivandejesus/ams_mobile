import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { get } from "lodash";
import { SessionService } from "../../../../shared/security/session.service";
import { UsernameValidator } from "../../../../shared/validators/username.validator";

export interface AccountActivationFormPayload {
  activation: {
    password: {
      first: string,
      second: string,
    },
    username: {
      first: string,
      second: string,
    },
    transactionPassword: {
      first: string,
      second: string,
    },
  },
  activationCode: string,
}

export class AccountActivationForm {
  formBuilder: FormBuilder;
  sessionService: SessionService;
  activation: FormGroup;
  usernameValidator: UsernameValidator;

  isSubmitting: boolean = false;
  isReadOnly: boolean = false;

  constructor(
    formBuilder: FormBuilder,
    sessionService: SessionService,
    usernameValidator: UsernameValidator
  ) {
    this.sessionService = sessionService;
    this.usernameValidator = usernameValidator;
    this.buildForm(formBuilder);
  }

  buildForm(formBuilder: FormBuilder): void {
    this.activation = formBuilder.group({
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      newUsername: ['', Validators.required, this.usernameValidator.exists.bind(this.usernameValidator)],
      confirmUsername: ['', Validators.required],
      newTransactionPassword: ['', Validators.required],
      confirmTransactionPassword: ['', Validators.required],
    });
  }

  createPayload(): AccountActivationFormPayload {
    const session = this.sessionService.getNonObservableSession();

    const payload = {
      activation: {
        password: {
          first: this.activation.get('newPassword').value,
          second: this.activation.get('confirmPassword').value,
        },
        username: {
          first: this.activation.get('newUsername').value,
          second: this.activation.get('confirmUsername').value,
        },
        transactionPassword: {
          first: this.activation.get('newTransactionPassword').value,
          second: this.activation.get('confirmTransactionPassword').value,
        }
      },
      activationCode: session.user.activationCode,
    };

    return payload;
  }

  setErrors(formErrors: any): void  {
    this.activation.setErrors({ 'formError': get(formErrors, 'errors') });
    this.activation.get('newUsername').setErrors({ 'formError': get(formErrors, 'children.username.children.first.errors') });
    this.activation.get('confirmUsername').setErrors({ 'formError': get(formErrors, 'children.username.children.second.errors') });
    this.activation.get('newPassword').setErrors({ 'formError': get(formErrors, 'children.password.children.first.errors') });
    this.activation.get('confirmPassword').setErrors({ 'formError': get(formErrors, 'children.password.children.second.errors') });
    this.activation.get('newTransactionPassword').setErrors({ 'formError': get(formErrors, 'children.transactionPassword.children.first.errors') });
    this.activation.get('confirmTransactionPassword').setErrors({ 'formError': get(formErrors, 'children.transactionPassword.children.second.errors') });
  }

  reset(): void {
    this.activation.reset();
  }
}
