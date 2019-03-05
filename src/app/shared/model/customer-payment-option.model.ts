import _ from "lodash";
import Decimal from "decimal.js";
import { zero, format, isValidDecimal } from "../decimal.util";

export const SKRILL_LOGIN_URL = 'https://account.skrill.com/login';
export const NETELLER_LOGIN_URL = 'https://member.neteller.com/';

export interface CustomerPaymentOptionResponse {
  id: string;
  is_active: boolean;
  type: string;
  fields: any;
}

export interface CustomerPaymentOptionDetailsResponse {
  feeDisplay: string;
  freeCalendar: boolean;
  freeCalendarDisplay: string;
  freeFee: boolean;
  /**
   * API return isCountryRestricted and do not
   * specify what restriction it is. Apparently,
   * if this is true BANK payment option is restricted for the particular customer.
   */
  isCountryRestricted: boolean;
  displays: {
    label: string;
    details: {
      description: string;
      logo: string;
      note: string;
      selectBookie: string;
      selected: string;
    },
    fields: any[],
    method: any;
  }[],
}

export enum PAYMENT_OPTIONS_TYPE {
  Ecopayz = 'ECOPAYZ',
  Skrill = 'SKRILL',
  Neteller = 'NETELLER',
  Bitcoin = 'BITCOIN',
  Bank = 'BANK'
}

export class CustomerPaymentOption {
  id: number;
  type: string;
  isActive: boolean;

  /**
   * Note that not all payment option has email
   */
  email?: string;
  accountId: string;
  accountName?: string;
  accountAddress?: string;
  bankName?: string;
  bankAddress?: string;
  swiftCode?: string;
  isDefault?: boolean;
  birthDate?: string;
  citizenship?: string;
  details: CustomerPaymentOptionDetails;

  isBankRestricted: boolean;

  /**
   * A normalized display fields key/value pair
   * for easy looping on HTML
   */
  displayFields: any[];

  processingTimeDeposit: string;
  processingTimeWithdrawal: string;
  minimumDeposit: Decimal | string;
  maximumDeposit: Decimal | string;
  minimumWithdrawal: Decimal | string;
  maximumWithdrawal: Decimal | string;

  static fromResponse(response: CustomerPaymentOptionResponse, detailsResponse?: CustomerPaymentOptionDetailsResponse): CustomerPaymentOption {
    const customerPaymentOption = new CustomerPaymentOption();

    customerPaymentOption.id = +response.id;
    customerPaymentOption.type = response.type;
    customerPaymentOption.isActive = response.is_active;

    if (_.isPlainObject(response.fields)) {
      const fields = response.fields;

      customerPaymentOption.email = fields.hasOwnProperty('email') ? fields.email : '';
      customerPaymentOption.accountId = fields.hasOwnProperty('account_id') ? fields.account_id : '';
      customerPaymentOption.accountName = fields.hasOwnProperty('account_name') ? fields.account_name : '';
      customerPaymentOption.accountAddress = fields.hasOwnProperty('account_address') ? fields.account_address : '';
      customerPaymentOption.bankAddress = fields.hasOwnProperty('bank_address') ? fields.bank_address : '';
      customerPaymentOption.bankName = fields.hasOwnProperty('bank_name') ? fields.bank_name : '';
      customerPaymentOption.swiftCode = fields.hasOwnProperty('swift_code') ? fields.swift_code : '';
      customerPaymentOption.birthDate = fields.hasOwnProperty('birth_date') ? fields.birth_date : '';
      customerPaymentOption.citizenship = fields.hasOwnProperty('citizenship') ? fields.citizenship : '';
      customerPaymentOption.isDefault = fields.hasOwnProperty('is_default') ? fields.is_default : '';
    }

    if (detailsResponse) {
      customerPaymentOption.details = CustomerPaymentOptionDetails.fromResponse(detailsResponse);
      customerPaymentOption.displayFields =  customerPaymentOption.details.getDisplayFields(customerPaymentOption.type);
      customerPaymentOption.processingTimeDeposit = customerPaymentOption.details.getProcessingTimeForDeposit(customerPaymentOption.type);
      customerPaymentOption.processingTimeWithdrawal = customerPaymentOption.details.getProcessingTimeForWithdrawal(customerPaymentOption.type);
      customerPaymentOption.minimumDeposit = customerPaymentOption.details.getMinimumDeposit(customerPaymentOption.type);
      customerPaymentOption.maximumDeposit = customerPaymentOption.details.getMaximumDeposit(customerPaymentOption.type);
      customerPaymentOption.minimumWithdrawal = customerPaymentOption.details.getMinimumWithdrawal(customerPaymentOption.type);
      customerPaymentOption.maximumWithdrawal = customerPaymentOption.details.getMaximumWithdrawal(customerPaymentOption.type);
      
      customerPaymentOption.isBankRestricted = detailsResponse.isCountryRestricted;
    }

    return customerPaymentOption;
  }

  get doesCustomerHasIt(): boolean {
    // if the id is 0 then the
    // customer doesn't have the payment option.
    return this.id > 0;
  }

  get isEcopayz(): boolean {
    return this.type === PAYMENT_OPTIONS_TYPE.Ecopayz;
  }

  get isSkrill(): boolean {
    return this.type === PAYMENT_OPTIONS_TYPE.Skrill;
  }

  get isNeteller(): boolean {
    return this.type === PAYMENT_OPTIONS_TYPE.Neteller;
  }

  get isBitcoin(): boolean {
    return this.type === PAYMENT_OPTIONS_TYPE.Bitcoin;
  }

  get isBank(): boolean {
    return this.type === PAYMENT_OPTIONS_TYPE.Bank;
  }

  /**
   * Get fee display for a transaction type.
   * Note that the value returned in this function
   * should not be used on any computation use fee() instead.
   */
  feeDisplayFor(transactionType: string): string {
    return this.details.getFeeDisplayFor(transactionType, this.type);
  }

  fee(transactionType: string): Decimal {
    if (this.details.isFeeFree(transactionType, this.type)) {
      return new Decimal(zero());
    }

    return isValidDecimal(this.details.getFee(transactionType, this.type)) ?
      new Decimal(this.details.getFee(transactionType, this.type)) :
      new Decimal(zero());
  }
}

export class CustomerPaymentOptionDetails {
  feeDisplay: string;
  freeCalendar: boolean;
  freeCalendarDisplay: string;
  freeFee: boolean;
  isCountryRestricted: boolean;
  displays:  {
    label: string;
    details: {
      description: string;
      logo: string;
      note: string;
      selectBookie: string;
      selected: string;
    },
    fields: any[],
    method: any[];
  }[];

  static fromResponse(response: CustomerPaymentOptionDetailsResponse): CustomerPaymentOptionDetails {
    const details = new CustomerPaymentOptionDetails();
    details.feeDisplay = response.feeDisplay;
    details.freeCalendar = response.freeCalendar;
    details.freeCalendarDisplay = response.freeCalendarDisplay;
    details.freeFee = response.freeFee;
    details.isCountryRestricted = response.isCountryRestricted;
    details.displays = response.displays.map((display) => {
      return {
        label: display.label,
        details: display.details,
        fields: display.fields,
        method: display.method,
      }
    });

    return details;
  }

  getDisplayFor(type: string): any {
    return this.displays.find((display) => {
      return display.label.toUpperCase() === type;
    });
  }

  getDisplayFields(type: string): any {
    const display = this.getDisplayFor(type);

    return Object.keys(display.fields).reduce((acc: any[], value) => {
      acc.push({
        label: display.fields[value].label,
        value: display.fields[value].value
      });

      return acc;
    }, []);
  }

  getProcessingTimeForDeposit(type: string): string {
    const display = this.getDisplayFor(type);

    return display.method.deposit.processingTime;
  }

  getProcessingTimeForWithdrawal(type: string): string {
    const display = this.getDisplayFor(type);

    return display.method.withdrawal.processingTime;
  }

  getFeeDisplayFor(transactionType: string, paymentOptionType: string): string {
    if (this.isFeeFree(transactionType, paymentOptionType)) {
      return 'FREE';
    }

    if (this.isFeeFreeCalendar() && transactionType === 'withdrawal') {
      return this.freeCalendarDisplay;
    }

    return (+this.getFee(transactionType, paymentOptionType) * 100) + " %";
  }

  isFeeFree(transactionType: string, paymentOptionType: string) : boolean {
    if (transactionType === 'withdrawal') {
      return this.isFeeFreeCalendar();
    }
    
    return this.getFee(transactionType, paymentOptionType) === 'FREE';
  }

  isFeeFreeCalendar(): boolean {
    return this.freeCalendar;
  }

  getFee(transactionType: string, paymentOptionType: string): string {
    const display = this.getDisplayFor(paymentOptionType);
    
    return display.method[transactionType].fee;
  }

  getMinimumDeposit(paymentOptionType: string): string {
    const display = this.getDisplayFor(paymentOptionType);

    return isValidDecimal(display.method.deposit.minimumDeposit) ?
      format(new Decimal(display.method.deposit.minimumDeposit)):
      display.method.deposit.minimumDeposit;
  }

  getMaximumDeposit(paymentOptionType: string): string {
    const display = this.getDisplayFor(paymentOptionType);

    return isValidDecimal(display.method.deposit.maximumDeposit) ?
      format(new Decimal(display.method.deposit.maximumDeposit)):
      display.method.deposit.maximumDeposit; 
  }

  getMinimumWithdrawal(paymentOptionType: string): Decimal | string {
    const display = this.getDisplayFor(paymentOptionType);
    
    return isValidDecimal(display.method.deposit.minimumWithdrawal) ?
      format(new Decimal(display.method.deposit.minimumWithdrawal)):
      display.method.deposit.minimumWithdrawal; 
  }

  getMaximumWithdrawal(paymentOptionType: string): Decimal | string {
    const display = this.getDisplayFor(paymentOptionType);

    return isValidDecimal(display.method.deposit.maximumWithdrawal) ?
      format(new Decimal(display.method.deposit.maximumWithdrawal)):
      display.method.deposit.maximumWithdrawal; 
  }
}
