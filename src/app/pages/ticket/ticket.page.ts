import { Component, OnInit, ElementRef } from '@angular/core';
import { OnsNavigator } from 'ngx-onsenui';
import { SidenavService } from '../../shared/ui/sidenav.service';
import { TicketApi } from '../../shared/api/service/ticket.api';
import { TicketPayload, TicketList, ZendeskTicketList, TicketCommentList, ZendeskTicket, TicketComment } from '../../shared/model/ticket.model'
import { Observable, Subject, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SessionService } from '../../shared/security/session.service';
import { User } from '../../shared/model/security/session.model';
import { ListComponent } from '../../shared/component/list.component';
import { NotificationPage } from '../notification/notification.page';
import { NotificationApi } from '../../shared/api/service/notification.api';

@Component({
  selector: 'ons-page[app-ticket]',
  templateUrl: './ticket.page.html',
  styleUrls: ['./ticket.page.css']
})

export class TicketPage extends ListComponent implements OnInit {
  ticketList$: Observable<TicketList>;
  zendeskTicketList$: Observable<ZendeskTicketList>;
  zendeskTicketCommentList$: Observable<TicketCommentList>;
  zendeskTicketCommentList: TicketComment[];
  user$: Observable<User>;
  loadingError$ = new Subject<boolean>();
  private userEmail: string;

  constructor(
    private navigator: OnsNavigator,
    private sidenavService: SidenavService,
    private ticketApi: TicketApi,
    private sessionService: SessionService,
    public notificationApi: NotificationApi,
    private element: ElementRef,
    )
  {
    super(element.nativeElement);
  }

  ngOnInit(): void {
    this.user$ = this.sessionService.getUser();
    this.user$.subscribe((userDetails: User) => {
      this.userEmail = userDetails.email
    });

    this.zendeskTicketList$ = this.ticketApi.fetchZendeskTickets();

    // this.zendeskTicketList$ = this.ticketApi.fetchZendeskTickets().pipe(
    //   catchError((error) => {
    //     this.loadingError$.next(true);
    //     return of();
    //   })
    // );
  }

  openTicketDetails(ticket: ZendeskTicket, event): void  {

    console.log(event);
    
    const modal = document.querySelector('ons-modal');
    modal.show();

    const payload = {
      ticketId: ticket.id
    }

    this.zendeskTicketCommentList$ = this.ticketApi.fetchZendeskTicketDetails(payload);
    this.zendeskTicketCommentList$.subscribe((commentsList: TicketCommentList) => {
      modal.hide();
      this.zendeskTicketCommentList = commentsList.comments;
    });
  }

  gotoNotification(): void {
    this.navigator.element.pushPage(NotificationPage);
  }
}
