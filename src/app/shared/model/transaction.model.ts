import { PaginationResponse, InifiniteScrollableList } from "./scrollable-list.model";
import { Decimal } from "../number.util";
import { CurrencyResponse, Currency } from "./currency.model";
import { Date } from "../date.util";
import { isPlainObject } from 'lodash';
import * as moment from 'moment';
import { CustomerProductResponse, CustomerProduct } from "./customer-products.model";

export enum TRANSACTION_STATUS {
  Requested = 'Requested',
  Acknowledged = 'Acknowledged',
  Declined = 'Declined',
  Processed = 'Processed',
  Voided = 'Voided',
  Confirmed = 'Confirmed',
  PendingConfirmation = 'Pending Confirmation'
}

export enum TRANSACTION_TYPE {
  'Deposit' = 'Deposit',
  'Withdraw' = 'Withdraw',
  'Transfer' = 'Transfer',
  'Bonus' = 'Bonus',
  'P2P' = 'P2P',
  'DWL' = 'DWL',
  'Commission' = 'Commission',
  'Bet' = 'Bet',
  'Debit' = 'Debit',
  'Credit' = 'Credit'
}

export const TRANSACTION_TYPE_MAPPING = {
  1: TRANSACTION_TYPE.Deposit,
  2: TRANSACTION_TYPE.Withdraw,
  3: TRANSACTION_TYPE.Transfer,
  4: TRANSACTION_TYPE.Bonus,
  5: TRANSACTION_TYPE.P2P,
  6: TRANSACTION_TYPE.DWL,
  7: TRANSACTION_TYPE.Commission,
  8: TRANSACTION_TYPE.Bet,
  10: TRANSACTION_TYPE.Debit,
  11: TRANSACTION_TYPE.Credit
}

export interface ProductDetailsResponse {
  from: Array<{username: string, productName: string}>;
  isReceiver: boolean;
  to: Array<{username: string, productName: string}> ;
}

export interface TransactionResponse {
  id: number;
  amount: string;
  number: string;
  currency: CurrencyResponse;
  date: string;
  customer_fee: string;
  status: {
    id: number;
    label: string;
  }
  type: number;
  notes_in_details: string;
  is_voided: boolean;
  productDetails: ProductDetailsResponse;
  immutable_payment_option_data: string;
  voiding_reason: string;
  is_bitcoin_status_pending_confirmation: boolean;
  is_bitcoin_status_confirmed: boolean;
  customer_amount: string;
  commission_period: {
    dateFrom: string;
    dateTo: string;
    payoutAt: string;
  }
  commission_convertions: {
    GBP?: {
      amount: string;
      convertedAmount: string;
    }
    EUR?: {
      amount: string;
    }
  }
}

// TODO: make PaginationResponse generic if we are sure about that all
// items would be indexed on "items" key.
export interface TransactionHistoryResponse extends PaginationResponse {
  items: Array<TransactionResponse>;
}

export class ProductDetails {
  from: Array<{username: string, productName: string}>;
  isReceiver: boolean;
  to: Array<{username: string, productName: string}>;
  type: string;

  static fromResponse(type: string, response: ProductDetailsResponse): ProductDetails {
    const productDetails = new ProductDetails();

    productDetails.from = response.from;
    productDetails.isReceiver = response.isReceiver;
    productDetails.to = response.to;
    productDetails.type = type;

    return productDetails;
  }

  isP2P(): boolean {
    return this.type === TRANSACTION_TYPE.P2P;
  }

  isWithdrawal(): boolean {
    return this.type === TRANSACTION_TYPE.Withdraw;
  }

  isTransfer(): boolean {
    return this.type === TRANSACTION_TYPE.Transfer;
  }

  isBonus(): boolean {
    return this.type === TRANSACTION_TYPE.Bonus;
  }

  isDeposit(): boolean {
    return this.type === TRANSACTION_TYPE.Deposit;
  }

  isCommission(): boolean {
    return this.type === TRANSACTION_TYPE.Commission;
  }

  isCredit(): boolean {
    return this.type === TRANSACTION_TYPE.Credit;
  }

  isDebit(): boolean {
    return this.type === TRANSACTION_TYPE.Debit;
  }
}

export class Transaction {
  id: number;
  amount: Decimal;
  transactionNumber: string;
  currency: Currency
  date: Date;
  status: string;
  type: string;
  productDetails: ProductDetails;
  paymentOption: string;
  voidingReason: string;
  commissionDateFrom: Date;
  commissionDateTo: Date;
  commissionPayoutAt: Date;
  commissionConvertionsEUR: Decimal;
  commissionConvertionsGBP: Decimal;
  convertedAmount: Decimal;
  notesInDetails: string;
  fee: Decimal;
  customerAmount: Decimal;

  static fromResponse(response: TransactionResponse): Transaction {
    const transaction = new Transaction();

    transaction.id = response.id;
    transaction.amount = new Decimal(response.amount);
    transaction.transactionNumber = response.number;
    transaction.currency = Currency.fromResponse(response.currency);
    transaction.date = new Date(response.date);
    transaction.status = transaction.getStatusFromResponse(response);
    transaction.type = TRANSACTION_TYPE_MAPPING[response.type];
    transaction.productDetails = ProductDetails.fromResponse(transaction.type, response.productDetails);
    transaction.paymentOption = response.immutable_payment_option_data;
    transaction.voidingReason = response.voiding_reason;
    transaction.notesInDetails = response.notes_in_details;
    transaction.customerAmount = new Decimal(response.customer_amount);
    transaction.fee = new Decimal(response.customer_fee);

    if (transaction.productDetails.isCommission()) {
      transaction.commissionDateFrom = new Date(response.commission_period.dateFrom);
      transaction.commissionDateTo = new Date(response.commission_period.dateTo);
      transaction.commissionPayoutAt = new Date(response.commission_period.payoutAt);
      transaction.commissionConvertionsGBP = response.commission_convertions.GBP ? new Decimal(response.commission_convertions.GBP.amount) : null;
      transaction.commissionConvertionsEUR = response.commission_convertions.EUR ? new Decimal(response.commission_convertions.EUR.amount) : null;
      transaction.convertedAmount = response.commission_convertions.GBP ? new Decimal(response.commission_convertions.GBP.convertedAmount) : null;
    }

    return transaction;
  }

  getStatusFromResponse(response: TransactionResponse): string {
    let statusText = response.is_voided ? TRANSACTION_STATUS.Voided : response.status.label;

    if (response.is_bitcoin_status_pending_confirmation) {
      statusText = 'Pending Confirmation';
    } else if (response.is_bitcoin_status_confirmed) {
      statusText = 'Confirmed';
    }

    return statusText;
  }

  isWithdrawal(): boolean {
    return this.type === TRANSACTION_TYPE.Withdraw;
  }

  isRequested(): boolean {
    return this.status === TRANSACTION_STATUS.Requested;
  }

  isAcknowledged(): boolean {
    return this.status === TRANSACTION_STATUS.Acknowledged;
  }

  isDeclined(): boolean {
    return this.status === TRANSACTION_STATUS.Declined;
  }

  isProcessed(): boolean {
    return this.status === TRANSACTION_STATUS.Processed;
  }

  isVoided(): boolean {
    return this.status === TRANSACTION_STATUS.Voided;
  }

  paymentOptionDetails(): string {
    return this.paymentOption == ' ()' ? '(N/A)' : this.paymentOption;
  }

}

export class TransactionHistory extends InifiniteScrollableList<Transaction> {
  private constructor(paginationResponse: PaginationResponse, items: Array<Transaction>) {
    super(paginationResponse, items);
  }

  static create(): TransactionHistory {
    const transactionHistory = new TransactionHistory({
      total: 0,
      total_filtered: 0,
      limit: 20,
      page: 0,
    }, []);

    return transactionHistory;
  }

  static fromResponse(response: TransactionHistoryResponse): TransactionHistory {
    const items = response.items.map((item: TransactionResponse): Transaction => {
      return Transaction.fromResponse(item);
    });

    const transactionHistory = new TransactionHistory(response, items);

    return transactionHistory;
  }

}

export interface BitcoinTransactionResponse {
  id: number;
  amount: string;
  lock_down_rate_time_remaining: string;
  isDeclined: boolean;
  bitcoin: {
    acknowledged_by_user: boolean,
    rate: string,
    receiver_unique_address: string,
    rate_expired: boolean,
    confirmation_count?: number,
  };
  subtransactions: BitcoinSubtransactionResponse[];
}

export interface BitcoinSubtransactionResponse {
  amount: string;
  customer_product: CustomerProductResponse,
}

export class BitcoinTransaction {
  id: number;
  amount: Decimal;
  // We used moment for typehint cause
  // this property would have special format
  lockDownRateTimeRemaining: moment.Moment;
  adjustedRate: Decimal;
  receivingAddress: string;
  confirmationCount?: number;
  isRateExpired: boolean;
  isDeclined: boolean;
  subtransactions: BitcoinSubtransaction[];

  static fromResponse(response: BitcoinTransactionResponse): BitcoinTransaction | null{
    if (!isPlainObject(response)) {
      return null;
    }

    const transaction = new BitcoinTransaction();

    transaction.id = +response.id;
    transaction.amount = new Decimal(response.amount);
    transaction.adjustedRate = new Decimal(response.bitcoin.rate);
    transaction.receivingAddress = response.bitcoin.receiver_unique_address;

    // Format lock down rate
    const parts = response.lock_down_rate_time_remaining.split(':');
    transaction.lockDownRateTimeRemaining = moment(parts, 'HH:mm:ss');

    transaction.confirmationCount = isNaN(response.bitcoin.confirmation_count) ? null : response.bitcoin.confirmation_count;
    transaction.isRateExpired = response.bitcoin.rate_expired;
    transaction.isDeclined = response.isDeclined;

    transaction.subtransactions = response.subtransactions.map((subtransactionResponse: BitcoinSubtransactionResponse): BitcoinSubtransaction => {
      return BitcoinSubtransaction.fromResponse(subtransactionResponse, transaction.adjustedRate);
    });

    return transaction;
  }

  get isRequested(): boolean {
    if (this.isDeclined) {
      return false;
    }

    return this.confirmationCount === null;
  }

  get isConfirmed(): boolean {
    if (this.confirmationCount === null || isNaN(this.confirmationCount)) {
      return false;
    }

    return this.confirmationCount >= 3;
  }

  get isPending(): boolean {
    if (this.isDeclined) {
      return false;
    }

    if (this.confirmationCount === null || isNaN(this.confirmationCount)) {
      return false;
    }

    return this.confirmationCount < 3;
  }

  /**
   * There would be instance that the lock down rate time is already
   * expired (00:00:00) but the rate_expired property of the transaction
   * is still 'false.'
   */
  get shouldBeExpired(): boolean {
    if (this.isPending) {
      return false;
    }

    return !this.isRateExpired && this.isLockDownRateTimeExpired;
  }

  get isLockDownRateTimeExpired(): boolean {
    return this.lockDownRateTimeRemaining.format('HH:mm:ss') === '00:00:00';
  }

}

export class BitcoinSubtransaction {
  amount: Decimal;
  btc: Decimal;
  customerProduct: CustomerProduct;

  static fromResponse(response: BitcoinSubtransactionResponse, rate: Decimal): BitcoinSubtransaction {
    const subtransaction = new BitcoinSubtransaction();

    subtransaction.amount = new Decimal(response.amount);
    subtransaction.customerProduct = CustomerProduct.fromResponse(response.customer_product);
    subtransaction.btc = new Decimal(subtransaction.amount.valueOf() / rate.valueOf());

    return subtransaction;
  }
}
