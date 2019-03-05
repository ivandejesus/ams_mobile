import { Observable } from "rxjs";
import { User } from "../model/security/session.model";
import { SessionService } from "../security/session.service";
import { EventDispatcherService } from "../event/event-dispatcher.service";
import { WebsocketService } from "../ws/websocket.service";
import { AppInjector } from "../app.injector";
import { AlertService } from "../ui/alert.service";
import { Component } from "ngx-onsenui";
import { Event } from "../event/event";

@Component({
  template: ``
})
export class BaseComponent {
  user$: Observable<User>;

  protected sessionService: SessionService;
  protected eventDispatcherService: EventDispatcherService;
  protected websocketService: WebsocketService;
  protected alert: AlertService;

  constructor() {
    const injector = AppInjector.getInjector();
    this.sessionService = injector.get(SessionService);
    this.eventDispatcherService = injector.get(EventDispatcherService);
    this.websocketService = injector.get(WebsocketService);
    this.alert = injector.get(AlertService);

    this.user$ = this.getUser();
  }

  getUser(): Observable<User> {
    return this.sessionService.getUser();
  }

  get event$(): Observable<Event> {
    return this.eventDispatcherService.event$;
  }

  addWebsocketSubscription(topic: string, callback: Function): void {
    this.websocketService.addSubscription(topic, callback);
  }
}