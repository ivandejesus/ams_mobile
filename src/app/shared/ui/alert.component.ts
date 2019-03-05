import { Component, ViewChild, ElementRef, Input, AfterViewInit } from "ngx-onsenui";
import { BehaviorSubject, Observable } from "rxjs";
import { SessionStorageService } from "../security/session-storage.service";

@Component({
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements AfterViewInit {
  
  constructor(
    private element: ElementRef,
    private sessionStorageService: SessionStorageService
  ) {
  }

  @ViewChild('alert')
  alert: ElementRef

  @Input()
  type: string;

  @Input()
  title: string;

  @Input()
  message: string;

  @Input()
  subMessage?: string;

  @Input()
  cancelable: boolean = false;

  @Input()
  callback?: Function;

  private destroy = new BehaviorSubject<string>('');
  destroy$: Observable<string> = this.destroy.asObservable();
  
  ngAfterViewInit(): void {
    this.alert.nativeElement.show().then(() => {
      this.alert.nativeElement.removeAttribute('style');
    });
  }

  hide(): void {
    this.alert.nativeElement.hide();
  }

  cancel(): void {
    this.alert.nativeElement.hide();
    this.destroy.next('destroy');
  }

  onOk(): void {
    if (this.callback instanceof Function) {
      this.callback();
    }

    this.alert.nativeElement.hide();
    this.destroy.next('destroy');
  }

  onActivateLater(): void {
    this.sessionStorageService.setItem(SessionStorageService.ACTIVATE_LATER_STORAGE_KEY, '1');
    this.alert.nativeElement.hide();
    this.destroy.next('destroy');
  }
}
