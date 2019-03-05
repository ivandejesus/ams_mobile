import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { WithdrawalDetails } from './model/withdrawal-details.model';
import { TransactionApi } from '../../../../shared/api/service/transaction.api';
import { CustomerPaymentOption } from '../../../../shared/model/customer-payment-option.model';
import { CustomerProduct } from '../../../../shared/model/customer-products.model';
import { TransactionHistoryPage } from 'src/app/pages/transaction-history/transaction-history.page';
import { OnsNavigator } from 'ngx-onsenui';
import { User } from '../../../../shared/model/security/session.model';
import { SessionService } from '../../../../shared/security/session.service';

@Component({
    selector: 'tab[withdrawal]',
    templateUrl: './withdrawal.tab.html',
    styleUrls: ['./withdrawal.tab.css']
})
export class WithdrawalTab implements OnInit {
  user$: Observable<User>;
  withdrawalDetails$: Observable<WithdrawalDetails>;

  customerPaymentOptions: CustomerPaymentOption[];
  customerProducts: CustomerProduct[];

  constructor(
    private transactionApi: TransactionApi, 
    private sessionService: SessionService, 
    private navigator: OnsNavigator) { }

  ngOnInit(): void {
    this.user$ = this.sessionService.getUser();
    this.withdrawalDetails$ = this.transactionApi.getWithdrawalDetails();
    this.withdrawalDetails$.subscribe((withdrawalDetails: WithdrawalDetails) => {
      this.customerPaymentOptions = withdrawalDetails.customerPaymentOptions;
      this.customerProducts = withdrawalDetails.customerProducts;
    });
  }

  gotoTransactionHistory(): void {
    this.navigator.element.pushPage(TransactionHistoryPage);
  }
}
