import { Injectable } from 'ngx-onsenui';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class SidenavService {
  subject = new Subject();
  get menu$(): Observable<any> {
    return this.subject.asObservable();
  }

  open() {
    this.subject.next('open');
  }

  close() {
    this.subject.next('close');
  }
}
