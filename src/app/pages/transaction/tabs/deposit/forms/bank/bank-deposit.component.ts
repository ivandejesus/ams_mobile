import { Component, OnInit, Input } from '@angular/core';
import { CustomerPaymentOption } from '../../../../../../shared/model/customer-payment-option.model';

import { BankDepositForm } from './bank-deposit.form';
import { FormBuilder } from '@angular/forms';
import { CustomerProduct } from '../../../../../../shared/model/customer-products.model';
import { TransactionApi } from '../../../../../../shared/api/service/transaction.api';
import { SessionService } from '../../../../../../shared/security/session.service';
import { Observable } from 'rxjs';
import { User } from '../../../../../../shared/model/security/session.model';
import { finalize } from 'rxjs/operators';
import { AlertService } from 'src/app/shared/ui/alert.service';
import { TransactionComponent } from '../../../../../../shared/component/transaction.component';

@Component({
    selector: 'bank-deposit',
    templateUrl: './bank-deposit.component.html',
    styleUrls: ['./bank-deposit.component.css']
})
export class BankDepositComponent extends TransactionComponent implements OnInit {
  @Input()
  customerPaymentOption: CustomerPaymentOption;

  @Input()
  customerProducts: CustomerProduct[];
  
  private successDialogContent: string;
  private bankDetailsPopover: string = '';

  user$: Observable<User>;

  chosenCustomerProducts: number[] = [];

  form: BankDepositForm;

  constructor(
    private formBuilder: FormBuilder,
    private transactionApi: TransactionApi,
    private alertService: AlertService
    ) {
      super();
    }

  ngOnInit(): void {
    this.user$ = this.sessionService.getUser();
    this.form = new BankDepositForm(this.formBuilder, this.customerPaymentOption);
    
    for (const display of this.customerPaymentOption.displayFields) {
      if (display.label === 'Email') {
        this.successDialogContent = `Please login to your <b>BANK<b> account and transfer the requested funds to ${display.value}`
      }

      this.bankDetailsPopover += `<p><strong>${display.label} </strong> ${display.value}</p>`;
    }
  }

  onFileChange(event) {
    if(event.target.files && event.target.files.length) {
      this.form.transaction.patchValue({
        file: event.target.files[0]
      });
    }
  }

  showPopover(): void {
    this.alertService.defaultPopover({
      message: this.bankDetailsPopover
    });
  }

  onSubmit(): void {
    this.form.isSubmitting = true;

    const successHandler = (response: any) => {
      this.alertService.success({
        title: 'Success',
        message: 'Thank you for making a deposit!',
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
