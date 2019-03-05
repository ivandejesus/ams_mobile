import { Component, OnDestroy, OnInit } from '@angular/core';
import { BankAccountForm } from "./bank-account.form";
import { FormBuilder } from "@angular/forms";
import { OnsNavigator, Params } from "ngx-onsenui";
import { CustomerApi } from "../../../../shared/api/service/customer.api";
import { finalize } from "rxjs/operators";
import { CustomerPaymentOption } from "../../../../shared/model/customer-payment-option.model";
import { Observable } from "rxjs";
import { AlertService } from 'src/app/shared/ui/alert.service';
import { SessionStorageService } from "../../../../shared/security/session-storage.service";

@Component({
  selector: 'ons-page[app-bank-account]',
  templateUrl: './bank-account.component.html',
  styleUrls: ['./bank-account.component.css']
})
export class BankAccountComponent implements OnInit, OnDestroy {
  form: BankAccountForm;

  bankPaymentOption$: Observable<CustomerPaymentOption>;
  bankPaymentOption: CustomerPaymentOption;
  isUpdate: boolean = false;
  hasSaveBankAccount: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private navigator: OnsNavigator,
    private customerApi: CustomerApi,
    private params: Params,
    private alertService: AlertService,
    private sessionStorageService: SessionStorageService,
  ) { }

  ngOnInit(): void {
    this.form = new BankAccountForm(this.formBuilder);
    this.hasSaveBankAccount = this.params.data.hasSaveBankAccount;

    if (this.params.data.isUpdate) {
      this.isUpdate = true;

      this.bankPaymentOption$ = this.customerApi.getCustomerPaymentOption(this.params.data.id);
      this.bankPaymentOption$.subscribe((customerPaymentOption: CustomerPaymentOption) => {
        this.bankPaymentOption = customerPaymentOption;

        this.form.bankAccount.setValue({
          accountNumber: customerPaymentOption.accountId,
          accountName: customerPaymentOption.accountName,
          swiftCode: customerPaymentOption.swiftCode,
          bankName: customerPaymentOption.bankName,
          bankAddress: customerPaymentOption.bankAddress,
          birthDate: customerPaymentOption.birthDate,
          citizenship: customerPaymentOption.citizenship,
          accountAddress: customerPaymentOption.accountAddress,
          isDefault: +customerPaymentOption.isDefault,
          saveBankAccount: false,
        });
      });
    }

    
  }

  ngOnDestroy(): void {
  }

  onSubmit(): void {
    this.form.isSubmitting = true;

    const successHandler = (customerPaymentOptionResponse: any) => {
      const customerPaymentOption = CustomerPaymentOption.fromResponse(customerPaymentOptionResponse);

      if (this.hasSaveBankAccount && !this.form.bankAccount.get('saveBankAccount').value) {
        this.sessionStorageService.setItem(SessionStorageService.BANK_ACCOUNT_STORAGE_KEY, JSON.stringify(customerPaymentOption));
      }

      this.alertService.success({
        title: 'Success',
        message: 'Your ' + customerPaymentOption.bankName +  ' account has been successfully ' +  (this.isUpdate ? 'updated' : 'linked') + '.'
      }, () => {
        this.navigator.element.popPage();
      });
    }

    const errorHandler = (errorResponse: any) => {
      this.form.setErrors(errorResponse.error);
    }

    if (this.isUpdate) {
      this.customerApi.updateBankAccount(this.form.createPayload(false, this.params.data.id))
        .pipe(
          finalize(() => this.form.isSubmitting = false)
        )
        .subscribe(successHandler, errorHandler);
    } else {
      this.customerApi.linkBankAccount(this.form.createPayload(this.hasSaveBankAccount))
        .pipe(
          finalize(() => this.form.isSubmitting = false)
        )
        .subscribe(successHandler, errorHandler);
    }
  }

  resetForm(): void {
    this.form.reset();
  }
}
