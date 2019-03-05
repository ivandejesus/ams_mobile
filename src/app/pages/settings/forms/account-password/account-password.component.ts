import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AccountPasswordForm } from "./account-password.form";
import { FormBuilder } from "@angular/forms";
import { OnsNavigator } from "ngx-onsenui";
import { finalize } from "rxjs/operators";
import { CustomerApi } from "../../../../shared/api/service/customer.api";
import { AlertService } from 'src/app/shared/ui/alert.service';

@Component({
  selector: 'ons-page[account-password]',
  templateUrl: './account-password.component.html',
  styleUrls: ['./account-password.component.css']
})

export class AccountPasswordComponent implements OnInit, OnDestroy {
  form: AccountPasswordForm;

  constructor(
    private formBuilder: FormBuilder,
    private navigator: OnsNavigator,
    private customerApi: CustomerApi,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.form = new AccountPasswordForm(this.formBuilder);
  }

  ngOnDestroy(): void {
  }

  onSubmit(): void {
    this.form.isSubmitting = true;

    const successHandler = (response: any) => {
      this.alertService.success({
        title: 'Success',
        message: 'Account password has been successfully updated!'
        }, () => {
        this.navigator.element.popPage();
      });
    }

    const errorHandler = (errorResponse: any) => {
      this.form.setErrors(errorResponse.error);
    }

    this.customerApi.updateAccountPassword(this.form.createPayload())
      .pipe(
        finalize(() => this.form.isSubmitting = false)
      )
      .subscribe(successHandler, errorHandler);
  }
}