import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DepositDetails } from './model/deposit-details.model';
import { TransactionApi } from '../../../../shared/api/service/transaction.api';
import { CustomerPaymentOption } from '../../../../shared/model/customer-payment-option.model';
import { CustomerProduct } from '../../../../shared/model/customer-products.model';
import { OnsNavigator } from 'ngx-onsenui';
import { TransactionHistoryPage } from 'src/app/pages/transaction-history/transaction-history.page';

@Component({
    selector: 'tab[deposit]',
    templateUrl: './deposit.tab.html',
    styleUrls: ['./deposit.tab.css']
})
export class DepositTab implements OnInit {
  depositDetails$: Observable<DepositDetails>;

  customerPaymentOptions: CustomerPaymentOption[];
  customerProducts: CustomerProduct[];

  constructor(private navigator: OnsNavigator, private transactionApi: TransactionApi) { }

  ngOnInit(): void {
    this.depositDetails$ = this.transactionApi.getDepositDetails();
    this.depositDetails$.subscribe((depositDetails: DepositDetails) => {
      this.customerPaymentOptions = depositDetails.customerPaymentOptions;
      this.customerProducts = depositDetails.customerProducts;
    });
  }

  gotoTransactionHistory(): void {
    this.navigator.element.pushPage(TransactionHistoryPage);
  }
}
