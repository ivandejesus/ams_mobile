import { MemberPaymentOptionEvent } from "./member-payment-option.event";

export class MemberPaymentOptionCreatedEvent extends MemberPaymentOptionEvent {
  static NAME: string = 'event.member_payment_option_created';

  constructor(payload: any) {
    super(payload, MemberPaymentOptionCreatedEvent.NAME);
  }
}
