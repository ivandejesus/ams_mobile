import { FormBuilder, Validators, FormArray, FormGroup, FormControl } from "@angular/forms";
import { WithdrawalForm, WithdrawalFormPayload } from "../../../../model/withdrawal.form";
import { CustomerPaymentOption } from "../../../../../../shared/model/customer-payment-option.model";
import { BitcoinExchangeRate } from '../../../../../../shared/model/bitcoin-exchange-rate.model';
import { get } from 'lodash';
import { Decimal, ZERO, BITCOIN_DECIMAL_PLACES } from '../../../../../../shared/number.util';
import { TransactionFormPayload } from "../../../../model/transaction.form";

export interface BitcoinWithdrawalPayload extends TransactionFormPayload {
  transaction: {
    paymentDetails: {
      rateDetails: {
        rangeStart: string,
        rangeEnd: string,
        adjustment: number,
        adjustmentType: string,
      },
      rate: number,
      blockchainRate: number
    },
    paymentOption: number,
    paymentOptionType: string,
    accountId: string,
    transactionPassword: string,
    customerFee: string,
    subTransactions: {
      [s: number]: {
        amount: number, 
        product: string,
        forFee: string,
        paymentDetails: {
          bitcoin: number,
        }
      }
    }
  }
}

export class BtcWithdrawalForm extends WithdrawalForm {
  constructor(
    formBuilder: FormBuilder,
    customerPaymentOption: CustomerPaymentOption) {

    super(customerPaymentOption);
    this.buildForm(formBuilder);
  }

  buildForm(formBuilder: FormBuilder): void {
    this.transaction = formBuilder.group({
      accountId: [this.customerPaymentOption.accountId, Validators.required],
      transactionPassword: ['', Validators.required],
      paymentOptionType: ['', Validators.required],
      paymentDetails: formBuilder.array([
        formBuilder.group({
          blockchainRate: '',
          rate: '',
        })
      ]),
      subtransactions: formBuilder.array([
        formBuilder.group({
          amount: ['0', Validators.required],
          btcAmount: ['0', Validators.required],
          product: ['', Validators.required],
          forFee: [true]
        })
      ])
    });
  }

  addSubtransaction(): void {
    const subtransactions = <FormArray>this.transaction.get('subtransactions');
    
    const formGroup = new FormGroup({
      product: new FormControl(''),
      amount: new FormControl('0'),
      btcAmount: new FormControl('0'),
      forFee: new FormControl([false]),
    });

    subtransactions.push(formGroup);
  }

  createPayload(exchangeRate: BitcoinExchangeRate): BitcoinWithdrawalPayload {
    const rateSetting = exchangeRate.getRateSettingBasedOnTotalBtc(this.totalBtcAmount); 

    const payload = {
      transaction: {
        paymentDetails: {
          rateDetails: {
            rangeStart: rateSetting.rangeStart.toFixed(10),
            rangeEnd: rateSetting.rangeEnd.toFixed(10),
            adjustmentType: rateSetting.adjustmentType,
            adjustment: rateSetting.getAdjustment(exchangeRate.latestBaseRate).valueOf(),
          },
          rate: exchangeRate.adjustedRate.valueOf(),
          blockchainRate: exchangeRate.latestBaseRate.valueOf(),
        },
        paymentOption: this.customerPaymentOption.id,
        paymentOptionType: this.customerPaymentOption.type.toLowerCase(),
        customerFee: ZERO,
        accountId: this.transaction.get('accountId').value,
        transactionPassword: this.transaction.get('transactionPassword').value,
        subTransactions: {},
      }
    }

    const subTransactions = [];
    let index = 0;

    for (const subtransaction of this.getSubtransactions().value) {
      subTransactions[index++] = {
        product: subtransaction.product,
        amount: subtransaction.amount,
        forFee: subtransaction.forFee,
        paymentDetails: {
          bitcoin: subtransaction.btcAmount,
        }
      }
    }

    payload.transaction.subTransactions = subTransactions;

    return payload;
  }

  get totalBtcAmount(): Decimal {
    const subtransactions = this.getSubtransactions();

    const total = subtransactions.value.reduce((accumulator: number, newValue: any) => {
      if (Decimal.isNaN(newValue.btcAmount)) {
        return accumulator + 0;
      }
      return accumulator + +newValue.btcAmount;
    }, 0);

    return new Decimal(total, BITCOIN_DECIMAL_PLACES);
  }

  setErrors(formErrors: any): void  {
    this.transaction.setErrors({ 'formError': get(formErrors, 'errors') });
    this.transaction.get('transactionPassword').setErrors({ 'formError': get(formErrors, 'children.transactionPassword.errors') });

    const subtransactionErrors = get(formErrors, 'children.subTransactions.children');

    let index = 0;
    for (const error of subtransactionErrors) {
      this.getSubtransactions().at(index).get('amount').setErrors({'formError': error.children.amount.errors});
      this.getSubtransactions().at(index).get('product').setErrors({'formError': error.children.product.errors});
      this.getSubtransactions().at(index).get('btcAmount').setErrors({'formError': error.children.paymentDetails.children.bitcoin.errors});

      index++;
    }
  }

  /**
   * Computes the amount based from adjusted rate from BTC total amount.
   *
   * @param adjustedRate - The adjustedRate computation based on BTC total amount.
   */
  convertFromBtc(adjustedRate: Decimal): void {
    const subtransactions = this.getSubtransactions();

    subtransactions.controls.forEach((control: FormControl) => {
      if (control instanceof FormGroup) {
        const value = control.value;

        const converted = new Decimal(value.btcAmount);
        converted.mul(adjustedRate);

        // emitViewToModelChange set to false so that setValue wont trigger ngModelChange
        control.get('amount').setValue(converted.toFixed(2), {emitEvent: false, onlySelf: true, emitViewToModelChange: false});
        // Since we don't dispatch ngModelChanges we need to update the value of the control manually.
        control.get('amount').updateValueAndValidity();
      }
    });
  }

  /**
   * Computes the btc based from adjusted rate from total amount.
   *
   * @param adjustedRate - The adjustedRate computation based on total amount.
   */
  convertToBtc(adjustedRate: Decimal): void {
    const subtransactions = this.getSubtransactions();

    subtransactions.controls.forEach((control: FormControl) => {
      if (control instanceof FormGroup) {
        const value = control.value;

        const converted = new Decimal(value.amount);
        converted.div(adjustedRate);

        // emitViewToModelChange set to false so that setValue wont trigger ngModelChange
        control.get('btcAmount').setValue(converted.toFixed(BITCOIN_DECIMAL_PLACES), {emitEvent: false, onlySelf: true, emitViewToModelChange: false});
        // Since we don't dispatch ngModelChanges we need to update the value of the control manually.
        control.get('btcAmount').updateValueAndValidity();
      }
    });
  }
}
