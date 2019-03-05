import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { TransactionHistory, TransactionHistoryResponse, Transaction, BitcoinTransaction, BitcoinTransactionResponse } from '../../model/transaction.model';
import { HttpService } from '../http/http.service';
import { map, shareReplay, share, tap, take } from 'rxjs/operators';
import { DepositDetails, DepositDetailsResponse } from '../../../pages/transaction/tabs/deposit/model/deposit-details.model';
import { WithdrawalDetails, WithdrawalDetailsResponse } from '../../../pages/transaction/tabs/withdrawal/model/withdrawal-details.model';
import { DepositFormPayload } from '../../../pages/transaction/model/deposit.form';
import { WithdrawalFormPayload } from '../../../pages/transaction/model/withdrawal.form';
import { TransferFormPayload } from '../../../pages/transaction/model/transfer.form';
import { BitcoinDepositFormPayload } from '../../../pages/transaction/tabs/deposit/forms/bitcoin/bitcoin-deposit.form';
import { Maybe } from '../../model/maybe.model';
import { BitcoinWithdrawalPayload } from '../../../pages/transaction/tabs/withdrawal/forms/bitcoin/btc-withdrawal.form';

@Injectable()
export class TransactionApi {
  private transactionHistoryList = new BehaviorSubject<TransactionHistory>(TransactionHistory.create());
  private refreshList = new BehaviorSubject<Function>(null);
  private loadingList = new BehaviorSubject<boolean>(false);

  transactionHistoryList$: Observable<TransactionHistory> = this.transactionHistoryList.asObservable();
  refreshList$: Observable<Function> = this.refreshList.asObservable();
  loadingList$: Observable<boolean> = this.loadingList.asObservable();

  constructor(private httpService: HttpService) { }

  loadTransactionHistoryList(filter: any, done?: Function): void {
    this.loadingList.next(true);
    this.getTransactionHistoryList(filter)
      .pipe(
        tap((transactionHistory: TransactionHistory) => {
          this.transactionHistoryList.next(transactionHistory);

          this.loadingList.next(false);
          if (done) {
            this.refreshList.next(done);
          }
        }),
        take(1)
      )
      .subscribe();
  }

  loadMoreTransactions(filter: any, done: Function): void {
    this.loadingList.next(true);
    this.getMoreTransactions(this.transactionHistoryList.value.nextPage(), filter)
    .pipe(
      tap((transactions: Transaction[]) => {  
        const transactionHistoryList = this.transactionHistoryList.value;
        transactionHistoryList.addItems(transactions);

        this.transactionHistoryList.next(transactionHistoryList);
        this.refreshList.next(done);
        this.loadingList.next(false);
      }),
      take(1)
    )
    .subscribe();
  }

  clearTransactionHistoryList(): void {
    this.transactionHistoryList.next(TransactionHistory.create());
  }

  getTransactionHistoryList(filter: any): Observable<TransactionHistory> {
    const params = this.httpService.buildQueryParamsFromPayload(filter);

    const makeTransactionHistoryList = map((response: TransactionHistoryResponse): TransactionHistory => {
      if(response.items === undefined) {
        response.items = [];
      }

      return TransactionHistory.fromResponse(response);
    });

    return this.httpService.get(`/overview/transaction-history?limit=20&${params}`).pipe(
      makeTransactionHistoryList,
      shareReplay(),
    );
  }

  getMoreTransactions(page: number, filter: any): Observable<Transaction[]> {
    const params = this.httpService.buildQueryParamsFromPayload(filter);
    const makeList = map((response: TransactionHistoryResponse): Transaction[] => {
      const history = TransactionHistory.fromResponse(response);
      return history.items;
    });

    return this.httpService.get(`/overview/transaction-history?limit=20&page=${page}&${params}`).pipe(
      makeList,
      shareReplay(),
    );
  }

  getDepositDetails(): Observable<DepositDetails> {
    const makeDepositDetails = map((response: DepositDetailsResponse): DepositDetails => {
      return DepositDetails.fromResponse(response);
    });

    return this.httpService.get(`/transactions/deposit-details`).pipe(
      makeDepositDetails,
    );
  }

  getWithdrawalDetails(): Observable<WithdrawalDetails> {
    const makeWithdrawalDetails = map((response: WithdrawalDetailsResponse): DepositDetails => {
      return WithdrawalDetails.fromResponse(response);
    });

    return this.httpService.get(`/transactions/withdraw-details`).pipe(
      makeWithdrawalDetails,
    );
  }

  deposit(payload: DepositFormPayload | BitcoinDepositFormPayload | FormData): Observable<void> {
    return this.httpService.post('/transactions/deposit', payload);
  }

  withdraw(payload: WithdrawalFormPayload | BitcoinWithdrawalPayload): Observable<void> {
    return this.httpService.post('/transactions/withdraw', payload);
  }

  transfer(payload: TransferFormPayload): Observable<void> {
    return this.httpService.post('/transactions/transfer', payload);
  }

  p2pTransfer(payload: TransferFormPayload): Observable<void> {
    return this.httpService.post('/transactions/p2pTransfer', payload);
  }
  
  checkForActiveBitcoinTransaction(): Observable<Maybe<BitcoinTransaction>> {
    const makeBitcoinTransaction = map((response: BitcoinTransactionResponse): Maybe<BitcoinTransaction> => {
      return Maybe.fromValue(BitcoinTransaction.fromResponse(response));
    });
    
    return this.httpService.get('/transactions/check-for-active-bitcoin-transaction').pipe(
      makeBitcoinTransaction
    );
  }

  acknowledgeBitcoinTransaction() {
    return this.httpService.put('/transactions/acknowledge-bitcoin-transaction');
  }

  declineBitcoinTransaction() {
    return this.httpService.put('/transactions/decline-bitcoin-transaction');
  }

  lockRateBitcoinTransaction() {
    return this.httpService.put('/transactions/lock-rate-bitcoin-transaction');
  }
}
