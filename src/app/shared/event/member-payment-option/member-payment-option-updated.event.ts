import { MemberPaymentOptionEvent } from "./member-payment-option.event";

export class MemberPaymentOptionUpdatedEvent extends MemberPaymentOptionEvent {
  static NAME: string = 'event.member_payment_option_updated';

  constructor(payload: any) {
    super(payload, MemberPaymentOptionUpdatedEvent.NAME);
  }
}
