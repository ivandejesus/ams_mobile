import { OnInit, Component, OnsNavigator } from "ngx-onsenui";
import { CustomerPaymentOption } from "../../../../../../shared/model/customer-payment-option.model";
import { FormBuilder } from "@angular/forms";
import { TransactionApi } from "../../../../../../shared/api/service/transaction.api";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { BankWithdrawalForm } from "./bank-withdrawal.form";
import { CustomerApi } from "../../../../../../shared/api/service/customer.api";
import { BankAccountComponent } from "../../../../../settings/forms/bank-account/bank-account.component";
import { TransactionComponent } from "../../../../../../shared/component/transaction.component";
import { EventDispatcherService } from "../../../../../../shared/event/event-dispatcher.service";
import { Event } from "../../../../../../shared/event/event";
import { MemberPaymentOptionEvent } from "../../../../../../shared/event/member-payment-option/member-payment-option.event";
import { AlertService } from "src/app/shared/ui/alert.service";
import { SessionStorageService } from "../../../../../../shared/security/session-storage.service";

@Component({
  selector: 'bank-withdrawal',
  templateUrl: './bank-withdrawal.component.html',
  styleUrls: ['./bank-withdrawal.component.css']
})
export class BankWithdrawalComponent extends TransactionComponent implements OnInit {
  customerBankPaymentOptions$: Observable<CustomerPaymentOption[]>;
  customerBankPaymentOptions: CustomerPaymentOption[];
  selectedBankPaymentOption: CustomerPaymentOption;
  defaultPaymentOption: CustomerPaymentOption;

  form: BankWithdrawalForm;

  constructor(
    private navigator: OnsNavigator,
    private formBuilder: FormBuilder,
    private transactionApi: TransactionApi,
    private customerApi: CustomerApi,
    private dispatcherService: EventDispatcherService,
    private alertService: AlertService,
    private sessionStorageService: SessionStorageService,
  ) {
      super();
  }

  ngOnInit(): void {
    this.user$ = this.sessionService.getUser();
    this.form = new BankWithdrawalForm(this.formBuilder, this.customerPaymentOption);

    this.dispatcherService.event$.subscribe((event: Event): void => {
      if (event instanceof MemberPaymentOptionEvent) {
        this.loadPaymentOptions();
      }
    });

    this.loadPaymentOptions();
  }

  loadPaymentOptions(): void {
    this.customerBankPaymentOptions$ = this.customerApi.getCustomerBankPaymentOptions();
    this.customerBankPaymentOptions$.subscribe((customerBankPaymentOptions: CustomerPaymentOption[]) => {
      this.customerBankPaymentOptions = customerBankPaymentOptions;

      if (this.sessionStorageService.hasItem(SessionStorageService.BANK_ACCOUNT_STORAGE_KEY)) {
        this.defaultPaymentOption = JSON.parse(this.sessionStorageService.getItem(SessionStorageService.BANK_ACCOUNT_STORAGE_KEY));
        this.customerBankPaymentOptions.push(this.defaultPaymentOption);
      } else {
        this.defaultPaymentOption = this.customerBankPaymentOptions.find(paymentOption => paymentOption.isDefault == true);
      }

      if (this.defaultPaymentOption) {
        this.form.transaction.patchValue({
          bankPaymentOption: this.defaultPaymentOption.id
        });

        this.selectedBankPaymentOption = this.defaultPaymentOption;
      }
    });
  }

  onPaymentOptionChange(id: number): void {
    this.selectedBankPaymentOption = this.customerBankPaymentOptions.find(paymentOption => paymentOption.id == id);
  }

  onChargeFeeClicked(event: MouseEvent, j: number): void {
    this.form.checkChargeFee(j);
  }

  onSubmit(): void {
    this.form.isSubmitting = true;

    const successHandler = (response: any) => {
      this.alertService.success({
        title: 'Success',
        message: 'Please wait for customer service confirmation. You can view transaction status in Transactions overview.'
        }, () => {
        this.sessionStorageService.removeItem(SessionStorageService.BANK_ACCOUNT_STORAGE_KEY);
        this.loadPaymentOptions();
        this.resetForm();
      });
    }

    const errorHandler = (errorResponse: any) => {
      this.form.setErrors(errorResponse.error);
    }

    this.transactionApi.withdraw(this.form.createPayload())
      .pipe(
        finalize(() => this.form.isSubmitting = false)
      )
      .subscribe(successHandler, errorHandler);
  }

  gotoBankAccount(): void {
    this.navigator.element.pushPage(BankAccountComponent, {
      data: {
        hasSaveBankAccount: true,
      }
    });
  }
}
