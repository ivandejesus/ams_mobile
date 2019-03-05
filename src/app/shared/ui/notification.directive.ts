import { Directive, Input, ElementRef, OnInit } from "ngx-onsenui";

@Directive({
  selector: '[notificationStatus]'
})

export class NotificationStatusDirective implements OnInit {

  @Input()
  notificationStatus: string;

  constructor(private el: ElementRef) {
  }

  ngOnInit(): void {
    const isSaved = this.notificationStatus.indexOf('Saved') > -1;
    const isConfirmed = this.notificationStatus.indexOf('Confirm') > -1;
    const isDeclined = this.notificationStatus.indexOf('Declined') > -1;
    const isAcknowledged = this.notificationStatus.indexOf('Acknowledged') > -1;
    const isProcessed = this.notificationStatus.indexOf('Processed') > -1;
    const isVoided = this.notificationStatus.indexOf('Voided') > -1;
    const isProduct = this.notificationStatus.indexOf('Product') > -1;
    const isLinked = this.notificationStatus.indexOf('linked') > -1;

    if (isSaved) {
      this.saved();
    }

    if (isConfirmed) {
      this.confirmed();
    }

    if (isDeclined) {
      this.declined();
    }

    if (isAcknowledged) {
      this.acknowledged();
    }

    if (isProcessed) {
      this.processed();
    }

    if (isVoided) {
      this.voided();
    }

    if (isProduct) {
      this.product();
    }
    
    if (isLinked) {
      this.linked();
    }
  }

  saved(): void {
    this.el.nativeElement.classList.add('notification-saved');
  }

  confirmed(): void {
    this.el.nativeElement.classList.add('notification-confirmed');
  }

  declined(): void {
    this.el.nativeElement.classList.add('notification-declined');
  }

  acknowledged(): void {
    this.el.nativeElement.classList.add('notification-acknowledged');
  }

  processed(): void {
    this.el.nativeElement.classList.add('notification-processed');
  }

  voided(): void {
    this.el.nativeElement.classList.add('notification-voided');
  }

  product(): void {
    this.el.nativeElement.classList.add('notification-product');
  }

  linked(): void {
    this.el.nativeElement.classList.add('notification-linked');
  }
}
