import { Injectable } from "ngx-onsenui";
import { Subject, Observable } from "rxjs";
import { Event } from "./event";

@Injectable()
export class EventDispatcherService {
  private subject: Subject<Event> = new Subject();
  event$: Observable<Event> = this.subject.asObservable();

  dispatch<T extends Event>(event: T) {
    this.subject.next(event);
  }
}
