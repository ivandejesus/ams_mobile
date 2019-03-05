import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AccountUsernameForm } from "./account-username.form";
import { FormBuilder } from "@angular/forms";
import { OnsNavigator } from "ngx-onsenui";
import { finalize } from "rxjs/operators";
import { CustomerApi } from "../../../../shared/api/service/customer.api";
import { SessionService } from "../../../../shared/security/session.service";
import { AlertService } from 'src/app/shared/ui/alert.service';

@Component({
  selector: 'ons-page[account-username]',
  templateUrl: './account-username.component.html',
  styleUrls: ['./account-username.component.css']
})

export class AccountUsernameComponent implements OnInit, OnDestroy {
  form: AccountUsernameForm;

  constructor(
    private formBuilder: FormBuilder,
    private navigator: OnsNavigator,
    private customerApi: CustomerApi,
    private sessionService: SessionService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.form = new AccountUsernameForm(this.formBuilder);
  }

  ngOnDestroy(): void {
  }

  onSubmit(): void {
    this.form.isSubmitting = true;

    const successHandler = (response: any) => {
      const session = this.sessionService.getSession();

      session.value.user.username = this.form.security.get('newUsername').value;
      this.sessionService.saveSession(session.value);

      this.alertService.success({
        title: 'Success',
        message: 'Account username has been successfully updated!'
        }, () => {
        this.navigator.element.popPage();
      });
    }

    const errorHandler = (errorResponse: any) => {
      this.form.setErrors(errorResponse.error);
    }

    this.customerApi.updateAccountUsername(this.form.createPayload())
      .pipe(
        finalize(() => this.form.isSubmitting = false)
      )
      .subscribe(successHandler, errorHandler);
  }
}
