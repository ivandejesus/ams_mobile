import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SessionService } from '../../security/session.service';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {
  constructor(private sessionService: SessionService) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const successHandler = (response) => {
      // Intercept ecopayz successful form response.
      if (response.headers && response.headers.get('x-redirect-url')) {
        window.location = response.headers.get('x-redirect-url');
      }
    };

    const errorHandler = (error): any => {
      if (error instanceof HttpErrorResponse ) {
        if (error.status === 401) {
          this.sessionService.clearSession();
        }
      }
    };

    request = request.clone({
      withCredentials: true
    });
    
    return next.handle(request).pipe(
      tap(successHandler, errorHandler),
    );
  }
}

