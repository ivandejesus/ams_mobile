import { Component, ViewChild, ElementRef, Input, AfterViewInit } from "ngx-onsenui";

@Component({
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements AfterViewInit {
  @ViewChild('toast')
  toast: ElementRef

  @Input()
  type: string;

  @Input()
  title: string;

  @Input()
  message: string;

  ngAfterViewInit(): void {
    this.toast.nativeElement.show().then(() => {
      this.toast.nativeElement.removeAttribute('style');
    });
  }

  hide(): void {
    this.toast.nativeElement.hide();
  }
}