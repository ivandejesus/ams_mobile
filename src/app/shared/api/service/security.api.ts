import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpService } from '../http/http.service';
import { LoginPayload, LoginResponse } from '../../model/security/login.model';

@Injectable()
export class SecurityApi {
  constructor(private httpService: HttpService) {

  }

  login(payload: LoginPayload): Observable<any> {
    return this.httpService.post('/login', payload);
  }

  logout(payload: any): Observable<any> {
    return this.httpService.post('/logout', payload);
  }
}
