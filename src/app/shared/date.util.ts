import * as moment from 'moment';

export function fromNow(date: string): string{
  return moment(date).fromNow();
}

export class Date {
  value: moment.Moment;
  format: string;

  constructor(value: string, format:string = "l") {
    this.value = moment(value);
    this.format = format;
  }

  toString() {
    return this.value.format(this.format);
  }
}
