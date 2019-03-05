import { Component, OnInit, ViewChild, ElementRef} from "ngx-onsenui";
import { fromEvent, Observable } from "rxjs";
import { map, pairwise } from "rxjs/operators";
import { OnsPageElement } from "onsenui";
import { ScrollEvent } from "../event/scroll.event";
/**
 * Implement this class if your component gonna use
 * the infinite scrollable feature of Onsen and at the same
 * time implementing scroll to top functionality.
 */
@Component({
  template: `<ons-speed-dial position="right bottom" direction="up" #speedDial></ons-speed-dial>`
})
export class ListComponent {
  private scrollEvent$;

  pullHookMessage: string = '';
  showSpinner: boolean = false;

  @ViewChild('speedDial') 
  speedDial: ElementRef;
  
  constructor(private page?: OnsPageElement) {

  }

  onInit() {
    this.page.addEventListener('show', () => {
      this.speedDial.nativeElement.hide();
    });

    this.getScrollingBehavior().subscribe((events: Array<ScrollEvent>) => {
      const prev = events[0];
      const curr = events[1];

      if (prev.isScrollingDown(curr) && curr.isScrollMetExpectedPercentage(40)) {
        this.speedDial.nativeElement.show();
      }

      if (curr.isOnTop()) {
        this.speedDial.nativeElement.hide();
      }
    });
  }

  getScrollingBehavior(): Observable<Array<ScrollEvent>> {
    const content = this.page.getElementsByClassName('page__content').item(0);
    this.scrollEvent$ = fromEvent(content, 'scroll');

    const mapScroll = map((event: any): ScrollEvent => {
      return ScrollEvent.fromNative(event);
    });

    // pairwise() basically get the previous ScrollEvent and merge it to
    // the current ScrollEvent making the result of stream as Array.
    return this.scrollEvent$.pipe(
      mapScroll,
      pairwise()
    );
  }

  onInfiniteScroll(callback: Function): void {
    this.page.onInfiniteScroll = callback;
  }

  scrollToTop() {
    this.page.scrollTop = 0;
  }

  onPullHookChangeState($event) {
    switch ($event.state) {
      case 'initial':
        this.pullHookMessage = '';
        break;
      case 'preaction':
        this.pullHookMessage = 'Release to refresh';
        break;
      case 'action':
        this.pullHookMessage = 'Loading data...';
        break;
    }
  }
}