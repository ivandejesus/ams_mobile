import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from "@angular/forms";
import { OnsNavigator } from "ngx-onsenui";
import { CustomerApi } from "../../../../shared/api/service/customer.api";
import { finalize } from "rxjs/operators";
import { TransactionPasswordForm } from "./transaction-password.form";
import { AlertService } from 'src/app/shared/ui/alert.service';

@Component({
  selector: 'ons-page[transaction-password]',
  templateUrl: './transaction-password.component.html',
  styleUrls: ['./transaction-password.component.css']
})

export class TransactionPasswordComponent implements OnInit, OnDestroy {
  form: TransactionPasswordForm;

  constructor(
    private formBuilder: FormBuilder,
    private navigator: OnsNavigator,
    private customerApi: CustomerApi,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.form = new TransactionPasswordForm(this.formBuilder);
  }

  ngOnDestroy(): void {
  }

  onSubmit(): void {
    this.form.isSubmitting = true;

    const successHandler = (response: any) => {
      this.alertService.success({
        title: 'Success',
        message: 'Transaction password has been successfully updated!'
        }, () => {
          this.navigator.element.popPage();
      });
    }

    const errorHandler = (errorResponse: any) => {
      this.form.setErrors(errorResponse.error);
    }

    this.customerApi.updateTransactionPassword(this.form.createPayload())
      .pipe(
        finalize(() => this.form.isSubmitting = false)
      )
      .subscribe(successHandler, errorHandler);
  }
}
