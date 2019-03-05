import { Component, OnInit } from '@angular/core';
import { CustomerPaymentOption } from '../../../../../../shared/model/customer-payment-option.model';

import { EcopayzDepositForm } from './ecopayz-deposit.form';
import { FormBuilder } from '@angular/forms';
import { TransactionApi } from '../../../../../../shared/api/service/transaction.api';
import { finalize } from 'rxjs/operators';
import { TransactionComponent } from '../../../../../../shared/component/transaction.component';
import { AlertService } from 'src/app/shared/ui/alert.service';

@Component({
    selector: 'ecopayz-deposit',
    templateUrl: './ecopayz-deposit.component.html',
    styleUrls: ['./ecopayz-deposit.component.css']
})
export class EcopayzDepositComponent extends TransactionComponent implements OnInit {
  private successDialogContent: string;

  form: EcopayzDepositForm;

  constructor(
    private formBuilder: FormBuilder,
    private transactionApi: TransactionApi,
    private alertService: AlertService) {
      super();
    }

  ngOnInit(): void {
    this.user$ = this.sessionService.getUser();
    this.form = new EcopayzDepositForm(this.formBuilder, this.customerPaymentOption);
    for (const display of this.customerPaymentOption.displayFields) {
      this.successDialogContent = `Please login to your ECOPAYZ account and transfer the requested funds to Merchant Account: ${display.value}`
    }
  }

  onSubmit(): void {
    this.form.isSubmitting = true;

    const successHandler = (response: any) => {
      this.alertService.success({
        title: 'Success',
        message: 'Please wait while you are being redirected.',
        subMessage: this.successDialogContent
        }, () => {
        this.form.reset();
      });
    }

    const errorHandler = (errorResponse: any) => {
      this.form.setErrors(errorResponse.error);
    }

    this.transactionApi.deposit(this.form.createPayload())
      .pipe(
        finalize(() => this.form.isSubmitting = false)
      )
      .subscribe(successHandler, errorHandler);
  }
}
