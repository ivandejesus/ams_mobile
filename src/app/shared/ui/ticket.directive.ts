import { Directive, Input, ElementRef, OnInit } from "ngx-onsenui";

@Directive({
  selector: '[ticketStatus]'
})

export class TicketStatusDirective implements OnInit {

  @Input()
  ticketStatus: string;

  constructor(private el: ElementRef) {

  }

  ngOnInit(): void {
    switch(this.ticketStatus) {
      case 'open':
        this.el.nativeElement.classList.add('ticket-open');
        break;
      case 'pending':
        this.el.nativeElement.classList.add('ticket-pending');
        break;
      case 'solved':
        this.el.nativeElement.classList.add('ticket-resolved');
        break;
      case 'closed':
        this.el.nativeElement.classList.add('ticket-closed');
        break;
    }
  }

}