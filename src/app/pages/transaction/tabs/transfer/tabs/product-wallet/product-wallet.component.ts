import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder } from "@angular/forms";
import { ProductWalletForm } from "./product-wallet.form";
import { TransactionApi } from "../../../../../../shared/api/service/transaction.api";
import { finalize } from 'rxjs/operators';
import { OnsNavigator } from 'ngx-onsenui';
import { TransactionHistoryPage } from '../../../../../transaction-history/transaction-history.page';
import { TransactionComponent } from "../../../../../../shared/component/transaction.component";
import { AlertService } from 'src/app/shared/ui/alert.service';

@Component({
  selector: 'tab[product-wallet]',
  templateUrl: './product-wallet.component.html',
  styleUrls: ['./product-wallet.component.css']
})

export class ProductWalletComponent extends TransactionComponent implements OnInit, OnDestroy {
  form: ProductWalletForm;

  constructor(
    private formBuilder: FormBuilder,
    private navigator: OnsNavigator,
    private transactionApi: TransactionApi,
    private alertService: AlertService
  ) {
    super();
  }

  ngOnInit(): void {
    this.user$ = this.sessionService.getUser();
    this.form = new ProductWalletForm(this.formBuilder);
  }

  ngOnDestroy(): void {
  }

  onSubmit(): void {
    this.form.isSubmitting = true;

    const successHandler = (response: any) => {
      this.alertService.success({
        title: 'Success',
        message: 'Please wait for customer service confirmation. You can view transaction status in Transactions overview.'
        }, () => {
          this.navigator.element.replacePage(TransactionHistoryPage);
      });      
    }

    const errorHandler = (errorResponse: any) => {
      this.form.setErrors(errorResponse.error);
    }

    this.transactionApi.transfer(this.form.createPayload())
      .pipe(
        finalize(() => this.form.isSubmitting = false)
      )
      .subscribe(successHandler, errorHandler);
  }
}
