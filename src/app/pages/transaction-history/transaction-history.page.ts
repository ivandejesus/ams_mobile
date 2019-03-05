import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { FormBuilder } from "@angular/forms";
import { OnsNavigator } from 'ngx-onsenui';
import { TransactionApi } from '../../shared/api/service/transaction.api';
import { Observable, Subject } from 'rxjs';
import { ListComponent } from '../../shared/component/list.component';
import { EventDispatcherService } from '../../shared/event/event-dispatcher.service';
import { Event } from '../../shared/event/event';
import { PaymentOptionApi } from '../../shared/api/service/payment-option.api';
import { PaymentOption } from '../../shared/model/payment-option.model';
import { TransactionHistoryFilterForm, TRANSACTION_HISTORY_TYPE_MAPPING, TRANSACTION_HISTORY_STATUS_MAPPING } from './transaction-history.form';
import { NotificationPage } from '../notification/notification.page';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { NotificationApi } from '../../shared/api/service/notification.api';

@Component({
    selector: 'ons-page[transaction_history]',
    templateUrl: './transaction-history.page.html',
    styleUrls: ['./transaction-history.page.css']
})
export class TransactionHistoryPage extends ListComponent implements OnInit, OnDestroy {
  form: TransactionHistoryFilterForm;
  paymentOptions$: Observable<PaymentOption[]>;
  transactionHistoryType: Object;
  transactionHistoryStatus: Object;
  private searchTerms = new Subject<string>();
  
  constructor(
    private navigator: OnsNavigator,
    private element: ElementRef,
    public transactionApi: TransactionApi,
    private paymentOptionApi: PaymentOptionApi,
    private formBuilder: FormBuilder,
    public notificationApi: NotificationApi,
    private dispatcherService: EventDispatcherService,
  ) {
    super(element.nativeElement);
  }

  ngOnInit(): void {
    super.onInit();
    this.form = new TransactionHistoryFilterForm(this.formBuilder);

    this.transactionHistoryType = TRANSACTION_HISTORY_TYPE_MAPPING
    this.transactionHistoryStatus = TRANSACTION_HISTORY_STATUS_MAPPING

    this.paymentOptions$ = this.paymentOptionApi.getPaymentOptions();
    this.transactionApi.loadTransactionHistoryList(this.form.createPayload());

    this.onInfiniteScroll((done: any) => {
      this.transactionApi.loadMoreTransactions(this.form.createPayload(), done);
    });

    this.transactionApi.refreshList$.subscribe((done: Function) => {
      if (done) {
        done();
      }
    });

    this.transactionApi.loadingList$.subscribe((isLoading: boolean) => {
      if (isLoading) {
        this.showSpinner = true;
      } else {
        this.showSpinner = false;
      }
    });

    this.dispatcherService.event$.subscribe((event: Event) => {
      this.transactionApi.loadTransactionHistoryList(this.form.createPayload());
    });

    this.searchTerms.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term: any) => this.onSearch(term)),
    );
  }

  ngOnDestroy(): void {
    this.transactionApi.clearTransactionHistoryList();
  }

  onPullHookRelease($event: any) {
    this.transactionApi.loadTransactionHistoryList(this.form.createPayload(), $event.done);
  }

  onFilter(): void {
    this.transactionApi.loadTransactionHistoryList(this.form.createPayload());
  }

  onReset(): void {
    this.form.resetFilter(this.formBuilder);
    this.transactionApi.loadTransactionHistoryList(this.formBuilder);
  }

  gotoNotification(): void {
    this.navigator.element.pushPage(NotificationPage);
  }

  onSearch(term: string): any {
    this.searchTerms.next(term);
    const search = {
      search: term
    }

    this.transactionApi.loadTransactionHistoryList(search);
  }
}
