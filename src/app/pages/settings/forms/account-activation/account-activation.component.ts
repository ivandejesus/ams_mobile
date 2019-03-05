import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountActivationForm } from "./account-activation.form";
import { FormBuilder } from "@angular/forms";
import { finalize } from "rxjs/operators";
import { OnsNavigator } from "ngx-onsenui";
import { CustomerApi } from "../../../../shared/api/service/customer.api";
import { SessionService } from "../../../../shared/security/session.service";
import { DashboardPage } from "../../../dashboard/dashboard.page";
import { UsernameValidator } from "../../../../shared/validators/username.validator";
import { AlertService } from 'src/app/shared/ui/alert.service';

@Component({
  selector: 'ons-page[account-activation]',
  templateUrl: './account-activation.component.html',
  styleUrls: ['./account-activation.component.css']
})
export class AccountActivationComponent implements OnInit, OnDestroy {
  form: AccountActivationForm;

  constructor(
    private formBuilder: FormBuilder,
    private navigator: OnsNavigator,
    private customerApi: CustomerApi,
    private sessionService: SessionService,
    private usernameValidator: UsernameValidator,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.form = new AccountActivationForm(this.formBuilder, this.sessionService, this.usernameValidator);
  }

  ngOnDestroy(): void {
  }

  onSubmit(): void {
    this.form.isSubmitting = true;

    const successHandler = (response: any) => {
      const session = this.sessionService.getSession();

      session.value.user.username = this.form.activation.get('newUsername').value;
      session.value.user.activationCode = '';
      this.sessionService.saveSession(session.value);

      this.alertService.success({
        title: 'Success',
        message: 'You have successfully activated your account.'
        }, () => {
          this.navigator.element.replacePage(DashboardPage);
      });
    }

    const errorHandler = (errorResponse: any) => {
      this.form.setErrors(errorResponse.error);
    }

    this.customerApi.activateAccount(this.form.createPayload())
      .pipe(
        finalize(() => this.form.isSubmitting = false)
      )
      .subscribe(successHandler, errorHandler);
  }
}
