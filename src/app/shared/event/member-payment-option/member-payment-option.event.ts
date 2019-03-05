import { Event } from "../event";

export class MemberPaymentOptionEvent extends Event {
  constructor(payload: any, name: string) {
    super(payload, name);
  }
}
