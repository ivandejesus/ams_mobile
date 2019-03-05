import { Component, OnInit } from "ngx-onsenui";
import { FormBuilder } from "@angular/forms";
import { TransactionApi } from "../../../../../../shared/api/service/transaction.api";
import { BitcoinDepositForm } from "./bitcoin-deposit.form";
import { BitcoinExchangeRate } from "../../../../../../shared/model/bitcoin-exchange-rate.model";
import { PaymentOptionApi } from "../../../../../../shared/api/service/payment-option.api";
import { finalize, take } from "rxjs/operators";
import { BitcoinTransaction } from "../../../../../../shared/model/transaction.model";
import { Maybe } from "../../../../../../shared/model/maybe.model";
import { BitcoinExchangeRateEvent } from "../../../../../../shared/event/bitcoin-exchange-rate.event";
import { TransactionProcessedEvent } from "../../../../../../shared/event/transaction-processed-event";
import { TransactionComponent } from "../../../../../../shared/component/transaction.component";
import { blink } from "../../../../../../shared/ui/utils/blink";
import { AlertService } from "src/app/shared/ui/alert.service";

import * as ClipboardJS from 'clipboard';
import { WebsocketTopics } from "../../../../../../shared/ws/topics";
import { Decimal } from "../../../../../../shared/number.util";

@Component({
  selector: 'bitcoin-deposit',
  templateUrl: './bitcoin-deposit.component.html',
  styleUrls: ['./bitcoin-deposit.component.css']
})
export class BitcoinDepositComponent extends TransactionComponent implements OnInit {
  form: BitcoinDepositForm;
  bitcoinExchangeRate: BitcoinExchangeRate;
  activeBitcoinTransaction?: BitcoinTransaction;
  rateInterval?: number;

  // Indicates when the expandable content is opened or not.
  opened: boolean = false;

  constructor(
    private formBuilder: FormBuilder, 
    private transactionApi: TransactionApi,
    private paymentOptionApi: PaymentOptionApi,
    private alertService: AlertService) {
      super();
    }

  ngOnInit(): void {
    this.paymentOptionApi.getBitcoinExchangeRate().subscribe((bitcoinExchangeRate: BitcoinExchangeRate): void => {
      this.bitcoinExchangeRate = bitcoinExchangeRate;
    });
    this.checkForActiveBitcoinTransaction();

    // Listen for exchange rates updates from Websocket 
    this.event$.subscribe((event) => {
      this.should(event instanceof BitcoinExchangeRateEvent && event.bitcoinExchangeRate.isDeposit(), () => {
        const btcRateEvent = <BitcoinExchangeRateEvent> event;
        this.bitcoinExchangeRate = btcRateEvent.bitcoinExchangeRate;
        // Manually call onAmountInputChanges to trigger correct recomputation.
        this.onBtcAmountInputChanges({});
        blink('exchange-rate');
      });
    });

    // Listen for transaction updates from Websocket 
    this.event$.subscribe((event) => {
      this.should(event instanceof TransactionProcessedEvent
        && this.activeBitcoinTransaction
        && event.transactionId === this.activeBitcoinTransaction.id, 
        () => {
          this.checkForActiveBitcoinTransaction();
      });
    });

    new ClipboardJS('#btcAddressLabel');
  }

  checkForActiveBitcoinTransaction(): void {
    this.transactionApi.checkForActiveBitcoinTransaction()
      .pipe(take(1))
      .subscribe((maybe: Maybe<BitcoinTransaction>): void => {
        this.activeBitcoinTransaction = maybe.getOrElse(null);

        // Should we subscrbe to bitcoin callbacks?
        this.should(this.activeBitcoinTransaction ? true : false, () => {
          this.addWebsocketSubscription(`${WebsocketTopics.BTC_REQUEST_STATUS}.${this.activeBitcoinTransaction.id}`, (payload) => {
            this.activeBitcoinTransaction.confirmationCount = payload.confirmation_count;
            this.opened = false;
            this.onExpandableContentClicked();
          });
        });

        // Should fill BitcoinDepositForm with Bitcoin Transaction Data?
        this.should(this.activeBitcoinTransaction ? true : false, () => this.form = BitcoinDepositForm.fill(this.formBuilder, this.customerPaymentOption, this.activeBitcoinTransaction));
        // Should create a new BitcoinDepositForm instead?
        this.should(this.activeBitcoinTransaction ? false : true, () =>  this.form = new BitcoinDepositForm(this.formBuilder, this.customerPaymentOption));
        // Should we start rate countdown?
        this.should(this.activeBitcoinTransaction && this.activeBitcoinTransaction.isRequested, () => this.startRateCountdown());
        // Should we lock Bitcoin Rate?
        this.should(this.activeBitcoinTransaction && this.activeBitcoinTransaction.shouldBeExpired, () => this.lockRateBitcoinTransaction());
        // Should open decline dialog?
        this.should(this.activeBitcoinTransaction && this.activeBitcoinTransaction.isDeclined && this.opened, () => 
          this.alertService.danger({
            title: 'Declined',
            message: 'Sorry, your request was DECLINED probably because we did not receive the bitcoin. If this is a mistake, please contact Support and we\'ll assist you right away.'
            }, () => {
            this.acknowledgeTransaction();
          })
        );
      });
  }
  
  onAmountInputChanges(event): void {
    if (this.activeBitcoinTransaction) {
      return;
    }

    this.bitcoinExchangeRate.adjustRateBasedOnTotalAmount(new Decimal(this.form.totalAmount.valueOf()));
    this.form.convertToBtc(this.bitcoinExchangeRate.adjustedRate);
  }

  onBtcAmountInputChanges(event): void {
    if (this.activeBitcoinTransaction) {
      return;
    }

    this.bitcoinExchangeRate.adjustRateBasedOnTotalBtc(this.form.totalBtcAmount);
    this.form.convertFromBtc(this.bitcoinExchangeRate.adjustedRate);
  }

  startRateCountdown(): void {
    if (this.activeBitcoinTransaction.isRateExpired || this.activeBitcoinTransaction.isLockDownRateTimeExpired) {
      return;
    }

    // Added setTimeout coz of the weird bug that dom
    // not being ready even ngIf condition is already evaluated.
    window.setTimeout(() => {
      const timerDom = document.getElementsByClassName('rate-timer')[0];
      const timeRemaining = this.activeBitcoinTransaction.lockDownRateTimeRemaining;
      const isExpired = (moment) => {
        return moment.format('HH:mm:ss') === '00:00:00';
      }
  
      timerDom.innerHTML = timeRemaining.format('HH:mm:ss');
  
      this.rateInterval = window.setInterval(() => {
        timeRemaining.subtract(1, 'seconds');
  
        if (isExpired(timeRemaining)) {
          window.clearInterval(this.rateInterval);
          this.lockRateBitcoinTransaction();
        }
  
        timerDom.innerHTML = timeRemaining.format('HH:mm:ss');
      }, 1000);
    }, 100);
  }

  onSubmit(): void {
    this.form.isSubmitting = true;
    const successHandler = (response: any) => {
      this.checkForActiveBitcoinTransaction();
    }

    const errorHandler = (errorResponse: any) => {
      this.form.setErrors(errorResponse.error);
    }

    this.transactionApi.deposit(this.form.createPayload(this.bitcoinExchangeRate))
      .pipe(
        finalize(() => this.form.isSubmitting = false)
      )
      .subscribe(successHandler, errorHandler);
  }

  onExpandableContentClicked(): void {
    // Should we open decline dialog
    this.should(this.activeBitcoinTransaction && this.activeBitcoinTransaction.isDeclined && !this.opened, () => {
      this.alertService.danger({
        title: 'Declined',
        message: 'Sorry, your request was DECLINED probably because we did not receive the bitcoin. If this is a mistake, please contact Support and we\'ll assist you right away.'
        }, () => {
        this.acknowledgeTransaction();
      });
    });
    
    // Should we open rate expired dialog?
    this.should(this.activeBitcoinTransaction 
      && this.activeBitcoinTransaction.isRateExpired
      && !this.activeBitcoinTransaction.isConfirmed 
      && !this.activeBitcoinTransaction.isPending 
      && !this.activeBitcoinTransaction.isDeclined 
      && !this.opened, () => {
      this.alertService.warning({
        title: 'Waiting',
        message: 'We are now waiting to receive your bitcoin. The page will automatically update when the bitcoin has been received.'
      });
    });

    // Should we open confirm dialog?
    this.should(this.activeBitcoinTransaction && this.activeBitcoinTransaction.isConfirmed && !this.opened, () => {
      this.alertService.success({
        title: 'Confirmed',
        message: 'Thank you for making a deposit!',
        subMessage: 'We are now verifying your deposit. Once we have received your deposit, you will see the additional funds reflected in your account.'
        }, () => {
          this.acknowledgeTransaction();
      });
    });
    
    this.opened = !this.opened;
  }

  isTransactionDeclinedOrRequested(): boolean {
    return this.activeBitcoinTransaction.isRequested || this.activeBitcoinTransaction.isDeclined;
  }

  isTransactionConfirmedOrPending(): boolean {
    return this.activeBitcoinTransaction.isPending || this.activeBitcoinTransaction.isConfirmed;
  }

  acknowledgeTransaction(): void {
    this.transactionApi.acknowledgeBitcoinTransaction()
      .pipe(take(1))
      .subscribe(() => {
        this.resetForm();
        this.activeBitcoinTransaction = null;
      });
  }

  lockRateBitcoinTransaction(): void {
    this.transactionApi.lockRateBitcoinTransaction()
      .pipe(take(1))
      .subscribe(() => {
        this.activeBitcoinTransaction.isRateExpired = true;
        this.alertService.warning({
          title: 'Waiting',
          message: 'We are now waiting to receive your bitcoin. The page will automatically update when the bitcoin has been received.'
        });
      });
  }
}
