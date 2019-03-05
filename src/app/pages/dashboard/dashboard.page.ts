import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { OnsNavigator } from 'ngx-onsenui';
import { TransactionPage } from '../transaction/transaction.page';
import { AffiliatePage } from '../affiliate/affiliate.page';
import { TransactionHistoryPage } from '../transaction-history/transaction-history.page';
import { SessionService } from '../../shared/security/session.service';
import { User } from '../../shared/model/security/session.model';
import { Observable } from 'rxjs';
import { CustomerApi } from '../../shared/api/service/customer.api';
import { CustomerProduct } from '../../shared/model/customer-products.model';
import { CustomerBalance } from '../../shared/model/balance.model';
import { SkypeBettingPage } from '../skype-betting/skype-betting.page';
import { NotificationPage } from '../notification/notification.page';
import { ProfilePage } from '../profile/profile.page';
import { ProductPage } from '../product/product.page';
import { TicketPage } from '../ticket/ticket.page';
import { EventDispatcherService } from '../../shared/event/event-dispatcher.service';
import { Event } from '../../shared/event/event';
import { NotificationApi } from '../../shared/api/service/notification.api';
import { AlertService } from 'src/app/shared/ui/alert.service';
import { AccountActivationComponent } from '../settings/forms/account-activation/account-activation.component';
import { take } from 'rxjs/operators';
import { SessionStorageService } from "../../shared/security/session-storage.service";
import { environment } from '../../../environments/environment';

@Component({
  selector: 'ons-page[dashboard]',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.css']
})
export class DashboardPage implements OnInit {
  user$: Observable<User>;
  customerProducts$: Observable<CustomerProduct[]>;
  balance$: Observable<CustomerBalance>;
  amsSigninUrl: string = environment.amsSigninUrl;
  amsSkypeBettingUrl: string = environment.amsSigninUrl + `&page=outstandingbet`;

  @ViewChild('carousel')
  private carousel: ElementRef;

  constructor(
    private navigator: OnsNavigator,
    private sessionService: SessionService,
    private customerApi: CustomerApi,
    private dispatcherService: EventDispatcherService,
    public notificationApi: NotificationApi,
    private alertService: AlertService,
    private sessionStorageService: SessionStorageService,
  ) { }

  ngOnInit(): void {
    this.user$ = this.sessionService.getUser();
    this.customerProducts$ = this.customerApi.getCustomerProducts();
    this.balance$ = this.customerApi.getBalance(this.customerProducts$);

    this.dispatcherService.event$.subscribe((event: Event) => {
      this.customerProducts$ = this.customerApi.getCustomerProducts();
      this.balance$ = this.customerApi.getBalance(this.customerProducts$);
    });

    const isActivateLater = this.sessionStorageService.getItem(SessionStorageService.ACTIVATE_LATER_STORAGE_KEY);

    this.user$
    .pipe(take(1))
    .subscribe((user: User): void => {
      if (!user.isActivated && !isActivateLater) {
        this.alertService.successActivation({
          title: 'Success',
          message: 'Welcome to Asianconnect Member Site!'
          }, () => {
            this.navigator.element.pushPage(AccountActivationComponent);
        });
      }
    });
  }

  openMenu(): void {
    this.navigator.element.pushPage(ProfilePage, {animation: 'fade-md'});
  }

  nextCustomerProduct(): void {
    this.carousel.nativeElement.next();
  }

  previousCustomerProduct(): void {
    this.carousel.nativeElement.prev();
  }

  gotoAffiliate(): void {
    this.navigator.element.pushPage(AffiliatePage);
  }

  gotoNotification(): void {
    this.navigator.element.pushPage(NotificationPage);
  }

  gotoProducts(): void {
    this.navigator.element.pushPage(ProductPage);
  }

  gotoDeposit(): void{
    this.navigator.element.pushPage(TransactionPage, {
      data: {
          type: 'deposit'
        }
      },
    );
  }

  gotoWithdraw(): void {
    this.navigator.element.pushPage(TransactionPage, {
      data: {
          type: 'withdrawal'
        }
      },
    );
  }

  gotoTransfer(): void {
    this.navigator.element.pushPage(TransactionPage, {
      data: {
          type: 'transfer'
        }
      },
    );
  }

  gotoTransactionHistory(): void {
    this.navigator.element.pushPage(TransactionHistoryPage);
  }

  gotoSkypeBetting(): void {
    this.navigator.element.pushPage(SkypeBettingPage);
  }

  gotoTicket(): void {
    this.navigator.element.pushPage(TicketPage);
  }
}
