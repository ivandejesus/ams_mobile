import { FormBuilder, Validators, FormArray, FormGroup, FormControl } from "@angular/forms";
import { CustomerPaymentOption } from "../../../../../../shared/model/customer-payment-option.model";
import { Decimal, ZERO, BITCOIN_DECIMAL_PLACES } from "../../../../../../shared/number.util";
import { BitcoinExchangeRate } from "../../../../../../shared/model/bitcoin-exchange-rate.model";
import { TransactionFormPayload } from "../../../../model/transaction.form";
import { DepositForm, DepositFormPayload } from "../../../../model/deposit.form";
import { get } from "lodash";
import { BitcoinTransaction, BitcoinSubtransaction } from "../../../../../../shared/model/transaction.model";

export interface BitcoinDepositFormPayload extends TransactionFormPayload {
  transaction: {
    paymentOptionType: string,
    paymentDetails: {
      rateDetails: {
        rangeStart: number,
        rangeEnd: number,
        adjustment: number,
        adjustmentType: string,
      },
      rate: number,
      blockchainRate: number
    },
    subTransactions: {
      [s: number]: {
        amount: number, 
        product: string,
        paymentDetails: {
          btc: number,
        }
      }
    }
  }
}

export class BitcoinDepositForm extends DepositForm {
  constructor(formBuilder: FormBuilder, customerPaymentOption: CustomerPaymentOption) {
    super(customerPaymentOption);
    this.buildForm(formBuilder);
  }

  buildForm(formBuilder: FormBuilder): void {
    this.transaction = formBuilder.group({
      email: [this.customerPaymentOption.email, Validators.required],
      subtransactions: formBuilder.array([
        formBuilder.group({
          product: ['', Validators.required],
          amount: ['0', Validators.required],
          btcAmount: ['0', Validators.required]
        })
      ])
    });
  }

  static fill(formBuilder: FormBuilder, customerPaymentOption: CustomerPaymentOption, transaction: BitcoinTransaction): BitcoinDepositForm {
    const form = new BitcoinDepositForm(formBuilder, customerPaymentOption);

    const subtransactionsFormGroups = transaction.subtransactions.map((subtransaction: BitcoinSubtransaction): FormGroup => {
      const formGroup = new FormGroup({
        // For display purposes only.
        product: new FormControl(subtransaction.customerProduct.displayName),
        amount: new FormControl(subtransaction.amount),
        btcAmount: new FormControl(subtransaction.btc),
      }); 

      return formGroup;
    });

    const subtransactionsFormGroup = <FormArray>form.transaction.get('subtransactions');
    subtransactionsFormGroup.removeAt(0);
    for (const fg of subtransactionsFormGroups) {
      subtransactionsFormGroup.push(fg);
    }

    return form;
  }

  addSubtransaction(): void {
    const subtransactions = <FormArray>this.transaction.get('subtransactions');
    
    const formGroup = new FormGroup({
      product: new FormControl(''),
      amount: new FormControl('0'),
      btcAmount: new FormControl('0'),
    });

    subtransactions.push(formGroup);
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
        control.get('btcAmount').setValue(converted.toFixed(5), {emitEvent: false, onlySelf: true, emitViewToModelChange: false});
        // Since we don't dispatch ngModelChanges we need to update the value of the control manually.
        control.get('btcAmount').updateValueAndValidity();
      }
    });
  }

  setErrors(formErrors: any): void  {
    const transactionErrors = get(formErrors, 'errors');
    const subtransactionErrors = get(formErrors, 'children.subTransactions.children');
  
    let index = 0;
    for (const error of subtransactionErrors) {
      this.getSubtransactions().at(index).get('amount').setErrors({'formError': error.children.amount.errors});
      this.getSubtransactions().at(index).get('product').setErrors({'formError': error.children.product.errors});
      this.getSubtransactions().at(index).get('btcAmount').setErrors({'formError': error.children.paymentDetails.children.bitcoin.errors});
      index++;
    }

    this.transaction.setErrors({'formError': transactionErrors});
  }

  createPayload(exchangeRate: BitcoinExchangeRate): BitcoinDepositFormPayload {
    const rateSetting = exchangeRate.getRateSettingBasedOnTotalBtc(this.totalBtcAmount);    

    const payload = {
      transaction: {
        paymentOptionType: this.customerPaymentOption.type,
        paymentOption: this.customerPaymentOption.id,
        customerFee: ZERO,
        paymentDetails: {
          rateDetails: {
            rangeStart: rateSetting.rangeStart.valueOf(),
            rangeEnd: rateSetting.rangeEnd.valueOf(),
            adjustmentType: rateSetting.adjustmentType,
            adjustment: rateSetting.getAdjustment(exchangeRate.latestBaseRate).valueOf(),
          },
          rate: exchangeRate.adjustedRate.valueOf(),
          blockchainRate: exchangeRate.latestBaseRate.valueOf(),
        },
        subTransactions: {},
      }
    }

    const subTransactions = [];
    let index = 0;

    for (const subtransaction of this.getSubtransactions().value) {
      subTransactions[index++] = {
        product: subtransaction.product,
        amount: subtransaction.amount,
        paymentDetails: {
          bitcoin: subtransaction.btcAmount,
        }
      }
    }

    payload.transaction.subTransactions = subTransactions;

    return payload;
  }
}