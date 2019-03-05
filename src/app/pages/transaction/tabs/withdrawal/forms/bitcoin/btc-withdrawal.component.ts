import { OnInit, Component, ViewChild, ElementRef, OnsNavigator } from "ngx-onsenui";
import { FormBuilder } from "@angular/forms";
import { TransactionApi } from "../../../../../../shared/api/service/transaction.api";
import { BtcWithdrawalForm } from "./btc-withdrawal.form";
import { BitcoinExchangeRate } from '../../../../../../shared/model/bitcoin-exchange-rate.model';
import { PaymentOptionApi } from '../../../../../../shared/api/service/payment-option.api';
import { finalize } from "rxjs/operators";
import { TransactionComponent } from "../../../../../../shared/component/transaction.component";
import { BitcoinExchangeRateEvent } from "../../../../../../shared/event/bitcoin-exchange-rate.event";
import { blink } from "../../../../../../shared/ui/utils/blink";
import { AlertService } from "src/app/shared/ui/alert.service";
import { Decimal } from "../../../../../../shared/number.util";

@Component({
  selector: 'btc-withdrawal',
  templateUrl: './btc-withdrawal.component.html',
  styleUrls: ['./btc-withdrawal.component.css']
})
export class BtcWithdrawalComponent extends TransactionComponent implements OnInit {
  form: BtcWithdrawalForm;
  bitcoinExchangeRate: BitcoinExchangeRate;

  @ViewChild('btcSuccessDialog')
  successDialog: ElementRef;

  constructor(
    private navigator: OnsNavigator,
    private formBuilder: FormBuilder, 
    private transactionApi: TransactionApi,
    private paymentOptionApi: PaymentOptionApi,
    private alertService: AlertService
  ) { 
    super();
  }

  ngOnInit(): void {
    this.form = new BtcWithdrawalForm(this.formBuilder, this.customerPaymentOption);
    this.paymentOptionApi.getWithdrawalBitcoinExchangeRate().subscribe((bitcoinExchangeRate: BitcoinExchangeRate): void => {
      this.bitcoinExchangeRate = bitcoinExchangeRate;
    });

    this.event$.subscribe((event) => {
      this.should(event instanceof BitcoinExchangeRateEvent && event.bitcoinExchangeRate.isWithdrawal(), () => {
        const btcRateEvent = <BitcoinExchangeRateEvent> event;
        this.bitcoinExchangeRate = btcRateEvent.bitcoinExchangeRate;
        // Manually call onAmountInputChanges to trigger correct recomputation.
        this.onBtcAmountInputChanges({});
        blink('exchange-rate');
      });
    });
  }

  onAmountInputChanges(event): void {
    this.bitcoinExchangeRate.adjustRateBasedOnTotalAmount(new Decimal(this.form.totalAmount.valueOf()));
    this.form.convertToBtc(this.bitcoinExchangeRate.adjustedRate);
  }

  onBtcAmountInputChanges(event): void {
    this.bitcoinExchangeRate.adjustRateBasedOnTotalBtc(this.form.totalBtcAmount);
    this.form.convertFromBtc(this.bitcoinExchangeRate.adjustedRate);
  }

  onSubmit(): void {
    this.form.isSubmitting = true;

    const successHandler = (response: any) => {
      this.alertService.success({
        title: 'Success',
        message: 'Please wait for customer service confirmation. You can view transaction status in Transactions overview.'
        }, () => {
          this.resetForm();
      });
    }

    const errorHandler = (errorResponse: any) => {
      this.form.setErrors(errorResponse.error);
    }

    this.transactionApi.withdraw(this.form.createPayload(this.bitcoinExchangeRate))
      .pipe(
        finalize(() => this.form.isSubmitting = false)
      )
      .subscribe(successHandler, errorHandler);
  }
}