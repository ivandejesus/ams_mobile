import { Component, OnInit } from '@angular/core';
import { SKRILL_LOGIN_URL } from '../../../../../../shared/model/customer-payment-option.model';

import { SkrillDepositForm } from './skrill-deposit.form';
import { FormBuilder } from '@angular/forms';
import { TransactionApi } from '../../../../../../shared/api/service/transaction.api';
import { finalize } from 'rxjs/operators';
import { TransactionComponent } from '../../../../../../shared/component/transaction.component';
import { AlertService } from 'src/app/shared/ui/alert.service';

@Component({
    selector: 'skrill-deposit',
    templateUrl: './skrill-deposit.component.html',
    styleUrls: ['./skrill-deposit.component.css']
})
export class SkrillDepositComponent extends TransactionComponent implements OnInit {
  private successDialogContent: string;

  form: SkrillDepositForm;

  constructor(
    private formBuilder: FormBuilder, 
    private transactionApi: TransactionApi,
    private alertService: AlertService) { 
      super();
    }

  ngOnInit(): void {
    this.user$ = this.sessionService.getUser();
    this.form = new SkrillDepositForm(this.formBuilder, this.customerPaymentOption);

    for (const display of this.customerPaymentOption.displayFields) {
      if (display.label === 'Email') {
        this.successDialogContent = `Please login to your SKRILL account and transfer the requested funds to ${display.value}`
      }
    }
  }

  onSubmit(): void {
    this.form.isSubmitting = true;

    const successHandler = (response: any) => {
      this.alertService.success({
        title: 'Success',
        message: 'Thank you for making a deposit!',
        subMessage: this.successDialogContent,
        }, () => {
        this.resetForm();
        window.open(SKRILL_LOGIN_URL, 'Ratting', 'left=700, top=300, width=600, height=400');
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