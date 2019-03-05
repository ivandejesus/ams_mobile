export class Event {
  payload: any;
  name: string;
  constructor(payload: any, name: string) {
    this.payload = payload;
    this.name = name;
  }
}