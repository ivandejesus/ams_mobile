import { Event } from "./event";

export class TransactionProcessedEvent extends Event {
  static NAME: string = 'event.transaction_processed';

  constructor(payload: any) {
    super(payload, TransactionProcessedEvent.NAME);
  }

  get transactionId(): number {
    return +this.payload.id;
  }

  get isDeclined(): boolean {
    return this.payload.status === 'Declined';
  }
}