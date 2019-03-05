import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { HttpService } from '../http/http.service';
import { map, shareReplay, tap, take, switchMap } from 'rxjs/operators';
import { Notification, NotificationResponse } from '../../model/notification.model';
import { cloneDeep } from 'lodash';

@Injectable()
export class NotificationApi {
  private notifications: BehaviorSubject<Notification[]> = new BehaviorSubject([]);
  private hasUnread: BehaviorSubject<boolean> = new BehaviorSubject(false);

  notifications$: Observable<Notification[]> = this.notifications.asObservable();
  hasUnread$: Observable<boolean> = this.hasUnread.asObservable();

  constructor(private httpService: HttpService) {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.getNotifications()
    .pipe(
      tap((notifications: Notification[]) => {
        this.notifications.next(notifications);
        for (const notif of notifications) {
          if (notif.read === false) {
            this.hasUnread.next(true);
          }
          
          break;
        }
      }),
      take(1)
    )
    .subscribe();
  }

  getNotifications(): Observable<Notification[]> {
    const mapToNotifications = map((response: NotificationResponse[]): Notification[] => {
      return response.map((nResponse: NotificationResponse): Notification => {
        return Notification.fromResponse(nResponse);
      });
    });

    return this.httpService.get('/customer/notifications').pipe(
      mapToNotifications,
      shareReplay(),
    );
  }

  readNotifications(): void {
    this.httpService.put('/customer/read-notifications').subscribe(() => {
      const notifications = cloneDeep(this.notifications.value).map((notification: Notification): Notification => {
        notification.read;

        return notification;
      });

      this.notifications.next(notifications);
      this.hasUnread.next(false);
    });
  }
}
