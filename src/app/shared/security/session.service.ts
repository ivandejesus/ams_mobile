import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { map, tap } from 'rxjs/operators';

import { SecurityApi, } from '../api/service/security.api';
import { StorageService } from './storage.service';
import { LoginResponse, LoginPayload } from '../model/security/login.model';
import { Session, User, SESSION_AUTHENTICATED } from '../model/security/session.model';

@Injectable()
export class SessionService {
  static STORAGE_KEY = 'zimitech-session';

  private session: BehaviorSubject<Session>;

  constructor(private storage: StorageService, private securityApi: SecurityApi) {
    this.session = new BehaviorSubject(Session.create());
  }

  initialize(): void {
    this.loadSession();
  }

  login(payload: LoginPayload): Observable<LoginResponse> {
    const createSession = tap<LoginResponse>(response => {
      const session = Session.fromResponse(response);
      this.saveSession(session);
    });

    return this.securityApi.login(payload).pipe(
      createSession
    );
  }

  logout(): Observable<void> {
    const clearSession =  tap<void>(() => this.clearSession());

    return this.securityApi.logout({}).pipe(clearSession);
  }

  saveSession(session: Session) {
    this.storage.setItem(SessionService.STORAGE_KEY, JSON.stringify(session));
    this.session.next(session);
  }

  getNonObservableSession(): Session {
    const storedData = this.storage.getItem(SessionService.STORAGE_KEY);
    return <Session>JSON.parse(storedData);
  }

  getSession(): BehaviorSubject<Session> {
    return this.session;
  }

  getUser(): Observable<User> {
    const user = (session: Session): User => {
      return session.user;
    }

    return this.session.pipe(
      map(user)
    );
  }

  getToken(): string {
    const storedData = this.storage.getItem(SessionService.STORAGE_KEY);
    const session = JSON.parse(storedData);

    return session.token;
  }

  loadSession() {
    try {
      const storedData = this.storage.getItem(SessionService.STORAGE_KEY);
      if (storedData) {
        this.session.next(Session.fromStorage(storedData));
      } else {
        this.session.next(Session.create());
      }
    } catch (e) {
      this.storage.removeItem(SessionService.STORAGE_KEY);
    }
  }

  // Note: that all subscribers depending on Session's observables
  // might throw an error. The reason is that, the session is being destroyed
  // first before the component. This is ok, as long as the app doesn't crash.
  // TODO: Consider destroying all components first so that all subscriptions
  // will be cleared.
  clearSession() {
    this.storage.removeItem(SessionService.STORAGE_KEY);
    this.storage.clear();
    const session = Session.create();

    this.session.next(session);
  }
}
