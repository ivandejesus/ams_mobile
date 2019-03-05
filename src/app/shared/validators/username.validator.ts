import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Injectable } from '@angular/core';
import { switchMap, mapTo, catchError } from 'rxjs/operators';
import { of, timer, Observable } from 'rxjs';
import { CustomerApi } from "../api/service/customer.api";


@Injectable()
export class UsernameValidator {
  constructor(private customerApi: CustomerApi) {

  }

  exists(control: AbstractControl): Observable<ValidationErrors> {
    return timer(3000).pipe(
      switchMap(() => this.customerApi.validateUsername(control.value).pipe(
        mapTo(null),
        catchError((response: any) => of({ formError: [response.error.message] }))
        )
      )
    );
  }
}
