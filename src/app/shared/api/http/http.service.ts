import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable()
export class HttpService {
  constructor(private http: HttpClient) {

  }

  post(url: string, data?: any): Observable<any> {
    // TODO create full path on HTTPInterceptor
    const fullPath = environment.apiUrl + '' + url;

    return this.http.post(fullPath, data);
  }

  get(url: string, params?: any): Observable<any> {
    // TODO create full path on HTTPInterceptor
    const fullPath = environment.apiUrl + '' + url;

    return this.http.get(fullPath, params);
  }

  buildQueryParamsFromPayload(params?: any): String {
    const encode = encodeURIComponent;

    return Object.keys(params)
    .map((key) => {
      if (params[key] !== '' && params[key] !== null && typeof params[key] != 'undefined') {
        return encode(key) + '=' + encode(params[key]);
      }
      return '';
    })
    .filter(part => part || part.length > 0).join('&');
  }

  put(url: string, data?: any): Observable<any> {
    // TODO create full path on HTTPInterceptor
    const fullPath = environment.apiUrl + '' + url;

    return this.http.put(fullPath, data);
  }
}
