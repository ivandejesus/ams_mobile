import { Component, OnInit } from '@angular/core';
import { NotificationApi } from '../../shared/api/service/notification.api';
import { Observable } from 'rxjs';
import { Notification } from '../../shared/model/notification.model';
import { EventDispatcherService } from '../../shared/event/event-dispatcher.service';
import { Event } from '../../shared/event/event';
import { TransactionProcessedEvent } from '../../shared/event/transaction-processed-event';

@Component({
  selector: 'ons-page[notification]',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.css']
})

export class NotificationPage implements OnInit {

  notification$: Observable<Notification[]>;

  constructor(
    private eventDispatcher: EventDispatcherService,
    public notificationApi: NotificationApi
  ) { }

  ngOnInit(): void {
    this.eventDispatcher.event$.subscribe((event: Event) => {
      if (event instanceof TransactionProcessedEvent) {
        this.notificationApi.loadNotifications();
      }      
    });

    this.notificationApi.readNotifications();
  }
}
