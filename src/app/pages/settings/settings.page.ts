import {Component, OnInit } from '@angular/core';
import { AccountActivationComponent } from './forms/account-activation/account-activation.component';
import { OnsNavigator } from 'ngx-onsenui';
import { AccountPasswordComponent } from './forms/account-password/account-password.component';
import { TransactionPasswordComponent } from './forms/transaction-password/transaction-password.component';
import { BankAccountComponent } from './forms/bank-account/bank-account.component';
import { AccountUsernameComponent } from "./forms/account-username/account-username.component";
import { Observable } from "rxjs";
import { User } from "../../shared/model/security/session.model";
import { SessionService } from "../../shared/security/session.service";
import { CustomerPaymentOption } from "../../shared/model/customer-payment-option.model";
import { CustomerApi } from "../../shared/api/service/customer.api";
import { Event } from "../../shared/event/event";
import { ToastService } from "../../shared/ui/toast.service";
import { EventDispatcherService } from "../../shared/event/event-dispatcher.service";
import { MemberPaymentOptionEvent } from "../../shared/event/member-payment-option/member-payment-option.event";
import { AlertService } from 'src/app/shared/ui/alert.service';
import { finalize } from "rxjs/operators";

@Component({
  selector: 'ons-page[settings]',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.css']
})
export class SettingsPage implements OnInit {
  customerBankPaymentOptions$: Observable<CustomerPaymentOption[]>;
  customerBankPaymentOptions: CustomerPaymentOption[];

  user$: Observable<User>;

  constructor(
    private navigator: OnsNavigator,
    private sessionService: SessionService,
    private customerApi: CustomerApi,
    private toastService: ToastService,
    private dispatcherService: EventDispatcherService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.user$ = this.sessionService.getUser();

    this.dispatcherService.event$.subscribe((event: Event): void => {
      if (event instanceof MemberPaymentOptionEvent) {
        this.loadBankPaymentOptions();
      }
    });

    this.loadBankPaymentOptions();
  }

  loadBankPaymentOptions(): void {
    this.customerBankPaymentOptions$ = this.customerApi.getCustomerBankPaymentOptions();
    this.customerBankPaymentOptions$.subscribe((customerBankPaymentOptions: CustomerPaymentOption[]) => {
      this.customerBankPaymentOptions = customerBankPaymentOptions;
    });
  }

  gotoAccountActivation(): void {
    this.navigator.element.pushPage(AccountActivationComponent);
  }

  gotoAccountPassword(): void {
    this.navigator.element.pushPage(AccountPasswordComponent);
  }

  gotoAccountUsername(): void {
    this.navigator.element.pushPage(AccountUsernameComponent);
  }

  gotoTransactionPassword(): void {
    this.navigator.element.pushPage(TransactionPasswordComponent);
  }

  gotoBankAccount(id?: number): void {
    this.navigator.element.pushPage(BankAccountComponent, {
        data: {
          id: id,
          isUpdate: id !== undefined,
          hasSaveBankAccount: false,
        }
      },
    );
  }

  deleteBank(id: number): void {
    this.alertService.okCancel({
      title: 'Remove bank',
      message: 'Are you sure you want to delete this Bank Account?'
      }, () => {
      const successHandler = (response: any) => {
        this.alertService.success({
          title: 'Success',
          message: 'Bank account has been deleted.'
        });
      };

      const errorHandler = (errorResponse: any) => {
      };

      this.customerApi.deleteBankAccount(id).subscribe(successHandler, errorHandler);
    });
  }
}
