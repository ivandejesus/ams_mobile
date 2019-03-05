import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule, EmailValidator } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';

// Services
import { HttpService } from './api/http/http.service';
import { CustomerApi } from './api/service/customer.api';
import { TransactionApi } from './api/service/transaction.api';
import { ProductApi } from "./api/service/product.api";
import { StorageService } from './security/storage.service';
import { SessionService } from './security/session.service';
import { ToastService } from './ui/toast.service';
import { WebsocketService } from './ws/websocket.service';
import { EventDispatcherService } from './event/event-dispatcher.service';
import { AlertService } from './ui/alert.service';
import { ChatService } from './ws/chat.service';
import { SessionStorageService } from "./security/session-storage.service";

// API Services
import { HttpClientModule } from '@angular/common/http';
import { SecurityApi } from './api/service/security.api';
import { NotificationApi } from './api/service/notification.api';
import { SkypeOutstandingBetsService } from './api/service/skype-outstanding-bets.api';
import { TicketApi } from './api/service/ticket.api';

// Directives
import { TabDirective } from './ui/tab.directive';
import { ToastDirective } from './ui/toast.directive';
import { TicketStatusDirective } from './ui/ticket.directive';
import { NotificationStatusDirective } from './ui/notification.directive';
import { AlertDirective } from './ui/alert.directive';
import { DecimalDirective } from './ui/decimal.directive';
import { FileInputDirective} from './ui/file-input.directive';

// Others
import { AppHttpInterceptor } from './api/http/app-http.interceptor';
import { SidenavService } from './ui/sidenav.service';
import { TransactionStatusDirective } from './ui/transaction-status.directive';
import { PaymentOptionApi } from './api/service/payment-option.api';
import { ListComponent } from './component/list.component';
import { ActivationModalComponent } from "./component/activation-modal/activation-modal.component";
import { ToastComponent } from './ui/toast.component';
import { TransactionComponent } from './component/transaction.component';
import { AlertComponent } from './ui/alert.component';
import { DecimalFormatPipe } from './pipes/decimal-format.pipe';
import { BaseComponent } from './component/base.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    ReactiveFormsModule,
    LaddaModule,
  ],
  exports: [
    ReactiveFormsModule,
    TabDirective,
    ToastDirective,
    TicketStatusDirective,
    TransactionStatusDirective,
    ListComponent,
    ActivationModalComponent,
    NotificationStatusDirective,
    AlertDirective,
    DecimalDirective,
    FileInputDirective,
    DecimalFormatPipe
  ],
  declarations: [
    BaseComponent,
    TabDirective,
    ToastDirective,
    TicketStatusDirective,
    TransactionStatusDirective,
    ListComponent,
    ActivationModalComponent,
    ToastComponent,
    NotificationStatusDirective,
    TransactionComponent,
    AlertDirective,
    AlertComponent,
    DecimalDirective,
    FileInputDirective,
    DecimalFormatPipe,
  ],
  providers: [
    HttpService,
    SessionService,
    SessionStorageService,
    StorageService,
    SidenavService,
    ToastService,
    WebsocketService,
    EventDispatcherService,
    AlertService,
    ChatService,

    SkypeOutstandingBetsService,
    SecurityApi,
    CustomerApi,
    TransactionApi,
    PaymentOptionApi,
    ProductApi,
    TicketApi,
    NotificationApi,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppHttpInterceptor,
      multi: true
    },
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],
})
export class SharedModule {

}
