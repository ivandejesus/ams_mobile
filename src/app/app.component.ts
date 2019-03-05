import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LoginPage } from './pages/login/login.page';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { SidenavService } from './shared/ui/sidenav.service';
import { SessionService } from './shared/security/session.service';
import { ProfilePage } from './pages/profile/profile.page';
import { ChatService } from './shared/ws/chat.service';

import { Session } from './shared/model/security/session.model';
import { EventDispatcherService } from './shared/event/event-dispatcher.service';
import { Event } from './shared/event/event';
import { TransactionProcessedEvent } from './shared/event/transaction-processed-event';
import { ToastService } from './shared/ui/toast.service';
import { ToastDirective } from './shared/ui/toast.directive';

import * as ons from "onsenui";
import { ActivatedRoute } from '@angular/router';
import { EcopayzPage } from './pages/ecopayz/ecopayz.page';
import { AlertDirective } from './shared/ui/alert.directive';
import { AlertService } from './shared/ui/alert.service';
import { WebsocketService } from './shared/ws/websocket.service';
import { CustomerApi } from './shared/api/service/customer.api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  sidePage: any = ProfilePage;

  @ViewChild('splitter')
  private splitter;

  @ViewChild('mainNavigation')
  private navigator: ElementRef;

  @ViewChild(ToastDirective)
  private toast: ToastDirective;

  @ViewChild(AlertDirective)
  private alert: AlertDirective;

  constructor(
    private activatedRoute: ActivatedRoute,
    private sideNavService: SidenavService, 
    private sessionService: SessionService,
    private websocketService: WebsocketService,
    private dispatcherService: EventDispatcherService,
    private toastService: ToastService,
    private alertService: AlertService,
    private chatService: ChatService,
    private customerApi: CustomerApi) {
    this.sideNavService.menu$.subscribe((action: string): void => {
      if (action === 'open') {
        this.splitter.nativeElement.side.open();
      } else {
        this.splitter.nativeElement.side.close();
      }
    });

    this.sessionService.initialize();
  }

  ngOnInit(): void {
    ons.disableAutoStyling();

    this.sessionService.getSession().subscribe((session: Session) => {
      if (session && session.user.isAuthenticated) {
        this.navigator.nativeElement.pushPage(DashboardPage, {data: { name: 'dashboard-page' }});
      } else {
        this.navigator.nativeElement.pushPage(LoginPage, {data: { name: 'login-page' }});
      }
    });

    this.sessionService.getSession().subscribe((session: Session) => {
      if (session && session.user.isAuthenticated) {
        this.websocketService.initialize(session.user.websocketToken, session.user.websocketChannelId);
        this.chatService.initializeZendeskWidget(session.user);
      } else {
        this.chatService.disableZendeskWidget();
        this.websocketService.close();
      }
    });
    
    this.subscribeToEvents();
    this.subscribeToRouteEvents();

    this.alertService.setHost(this.alert);
  }

  private subscribeToEvents(): void {
    const onTransactionProcessed = (event: TransactionProcessedEvent) => {     
      switch (event.payload.status) {
        case 'Confirm':
        case 'Processed':
        case 'Approved':
          this.toastService.success(this.toast, 'Notification', event.payload.message);
          break;
        case 'Saved':
        case 'Requested':
          this.toastService.warning(this.toast, 'Notification', event.payload.message);
          break;
        case 'Declined':
        case 'Voided':
          this.toastService.danger(this.toast, 'Notification', event.payload.message);
          break;
        case 'Acknowledged':
        case 'linked':
          this.toastService.general(this.toast, 'Notification', event.payload.message);
          break;
      }
    }

    this.dispatcherService.event$.subscribe((event: Event): void => {
      switch (event.name) {
        case TransactionProcessedEvent.NAME:
          onTransactionProcessed(<TransactionProcessedEvent>event);  
        break;
      }
    });
  }

  private subscribeToRouteEvents(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.hasOwnProperty('ecopayz')) {
        this.showEcopayzPage(params);
      }
      
      if (params.hasOwnProperty('from') && params.from === 'desktop') {
        this.createSession();
      }
    })
  }

  private createSession(): void {
    this.customerApi.getProfile().subscribe((response) => {
      const session = Session.fromResponse(response);
      this.sessionService.saveSession(session);
    });
  }

  private showEcopayzPage(params: any): void {
    this.navigator.nativeElement.pushPage(EcopayzPage, {
      data: {
        apiResult: params.ecopayz
      }
    });
  }
}
