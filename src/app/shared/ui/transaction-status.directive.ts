import { Directive, Input, ElementRef, OnInit } from "ngx-onsenui";
import { TRANSACTION_STATUS } from "../model/transaction.model";

@Directive({
  selector: '[transactionStatus], [transactionBodyStatus]'
})
export class TransactionStatusDirective implements OnInit {
  @Input()
  transactionStatus: string;

  @Input()
  transactionBodyStatus: string;

  constructor(private el: ElementRef) {

  }

  ngOnInit(): void {
    switch(this.transactionStatus) {
      case TRANSACTION_STATUS.Requested:
        this.el.nativeElement.classList.add('yellow-bg');
        break;
      case TRANSACTION_STATUS.Acknowledged:
      case TRANSACTION_STATUS.PendingConfirmation:
        this.el.nativeElement.classList.add('blue-bg');
        break;
      case TRANSACTION_STATUS.Processed:
      case TRANSACTION_STATUS.Confirmed:
        this.el.nativeElement.classList.add('green-bg');
        break;
      case TRANSACTION_STATUS.Declined:
      case TRANSACTION_STATUS.Voided:
        this.el.nativeElement.classList.add('red-bg');
        break;
    }

    switch(this.transactionBodyStatus) {
      case TRANSACTION_STATUS.Requested:
        this.el.nativeElement.classList.add('gradient-yellow');
        break;
      case TRANSACTION_STATUS.Acknowledged:
      case TRANSACTION_STATUS.PendingConfirmation:
        this.el.nativeElement.classList.add('gradient-blue');
        break;
      case TRANSACTION_STATUS.Processed:
      case TRANSACTION_STATUS.Confirmed:
        this.el.nativeElement.classList.add('gradient-green');
        break;
      case TRANSACTION_STATUS.Declined:
      case TRANSACTION_STATUS.Voided:
        this.el.nativeElement.classList.add('gradient-red');
        break;
    }
  }
}