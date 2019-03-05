import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'accountNumber' })
export class AccountNumber implements PipeTransform {
  transform(value: string): string {
    return value != null ? value.toString().replace(/.(?=.{4})/g, '*') : value;
  }
}
