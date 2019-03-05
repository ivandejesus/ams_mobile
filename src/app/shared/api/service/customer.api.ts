import { Injectable } from '@angular/core';
import { Observable, combineLatest, of } from 'rxjs';

import { HttpService } from '../http/http.service';
import { CustomerProductResponse, CustomerProduct } from '../../model/customer-products.model';
import { map, shareReplay, first } from 'rxjs/operators';
import { getAllocatedBalance, CustomerBalanceResponse, CustomerBalance } from '../../model/balance.model';
import { SessionService } from '../../security/session.service';
import { AccountPasswordFormPayload } from "../../../pages/settings/forms/account-password/account-password.form";
import { TransactionPasswordFormPayload } from "../../../pages/settings/forms/transaction-password/transaction-password.form";
import { AccountUsernameFormPayload } from "../../../pages/settings/forms/account-username/account-username.form";
import { AccountActivationFormPayload } from "../../../pages/settings/forms/account-activation/account-activation.form";
import { CustomerPaymentOption, CustomerPaymentOptionResponse } from "../../model/customer-payment-option.model";
import { BankAccountFormPayload } from "../../../pages/settings/forms/bank-account/bank-account.form";
import Decimal from 'decimal.js';

@Injectable()
export class CustomerApi {
  constructor(private httpService: HttpService, private sessionService: SessionService) {

  }

  getBalance(customerProducts$: Observable<CustomerProduct[]>): Observable<CustomerBalance> {
    const allocated$ = this.getAllocatedBalance(customerProducts$);
    const unallocated$ = this.getUnallocatedBalance();
    const user$ = this.sessionService.getUser().pipe(first());

    const mapToBalance = map(([allocated, unallocated, user]): CustomerBalance => {
      return new CustomerBalance(allocated, unallocated, user.currency);
    });

    return combineLatest(allocated$, unallocated$, user$).pipe(
      mapToBalance
    );
  }

  getAllocatedBalance(customerProducts$: Observable<CustomerProduct[]>): Observable<Decimal> {
    const mapToAllocatedBalance = map((payload: CustomerProduct[]): Decimal => {
      return getAllocatedBalance(payload);
    });

    return customerProducts$.pipe(
      mapToAllocatedBalance,
    );
  }

  getUnallocatedBalance(): Observable<Decimal> {
    const mapToUnallocatedBalance = map((payload: CustomerBalanceResponse): Decimal => {
      return new Decimal(payload.unallocated);
    });

    return this.httpService.get('/dashboard').pipe(
      mapToUnallocatedBalance,
    );
  }

  getCustomerProducts(): Observable<CustomerProduct[]> {
    const makeCustomerProducts = map((response: CustomerProductResponse[]): CustomerProduct[] => {
      return response.map((customerProductResponse: CustomerProductResponse): CustomerProduct => {
        return CustomerProduct.fromResponse(customerProductResponse);
      });
    });

    return this.httpService.get('/customer/products').pipe(
      makeCustomerProducts,
      shareReplay(), // avoid multiple HTTP Calls
    );
  }

  getCustomerPaymentOptions(): Observable<any[]> {
    return this.httpService.get('/customer/payment-options');
  }

  getCustomerBankPaymentOptions(): Observable<CustomerPaymentOption[]> {
    const makeCustomerPaymentOptions = map((response: CustomerPaymentOptionResponse[]): Array<CustomerPaymentOption> => {
      return response.map((customerPaymentOptionResponse: CustomerPaymentOptionResponse): CustomerPaymentOption => {
        return CustomerPaymentOption.fromResponse(customerPaymentOptionResponse);
      });
    });

    return this.httpService.get('/payment-option/bank').pipe(
      makeCustomerPaymentOptions,
      shareReplay(),
    );
  }

  getCustomerPaymentOption(id: number): Observable<CustomerPaymentOption> {
    const makeCustomerPaymentOption = map((response: CustomerPaymentOptionResponse): CustomerPaymentOption => {
        return CustomerPaymentOption.fromResponse(response);
    });

    return this.httpService.get(`/payment-option/find/${id}`).pipe(
      makeCustomerPaymentOption,
    );
  }

  updateAccountPassword(payload: AccountPasswordFormPayload): Observable<void> {
    return this.httpService.post('/update-credentials', payload);
  }

  updateTransactionPassword(payload: TransactionPasswordFormPayload): Observable<void> {
    return this.httpService.post('/update-credentials', payload);
  }

  updateAccountUsername(payload: AccountUsernameFormPayload): Observable<void> {
    return this.httpService.post('/update-credentials', payload);
  }

  activateAccount(payload: AccountActivationFormPayload): Observable<void> {
    return this.httpService.post('/activate', payload);
  }

  validateUsername(username: string): Observable<void> {
    return this.httpService.post('/account/check/username', { username: username });
  }

  linkBankAccount(payload: BankAccountFormPayload): Observable<void> {
    return this.httpService.post('/payment-option/bank/create', payload);
  }

  updateBankAccount(payload: BankAccountFormPayload): Observable<void> {
    return this.httpService.post('/payment-option/bank/update', payload);
  }

  deleteBankAccount(id: number): Observable<void> {
    return this.httpService.post('/payment-option/bank/delete', {
      memberPaymentOptionDelete: {
        memberPaymentOptionId: id,
      }
    });
  }

  getProfile(): Observable<any> {
    return this.httpService.get('/profile');
  }
}
