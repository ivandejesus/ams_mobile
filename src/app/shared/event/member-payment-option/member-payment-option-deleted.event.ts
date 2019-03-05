import { MemberPaymentOptionEvent } from "./member-payment-option.event";

export class MemberPaymentOptionDeletedEvent extends MemberPaymentOptionEvent {
  static NAME: string = 'event.member_payment_option_deleted';

  constructor(payload: any) {
    super(payload, MemberPaymentOptionDeletedEvent.NAME);
  }
}
