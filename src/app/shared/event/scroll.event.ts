/**
 * Wraps native js scroll event but with 
 * other util functions necessary for list components
 * though still can be usable to other components
 */
export class ScrollEvent {
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;

  static fromNative(nativeScrollEvent: any): ScrollEvent {
    const event = new ScrollEvent();

    event.scrollHeight = nativeScrollEvent.target.scrollHeight;
    event.scrollTop = nativeScrollEvent.target.scrollTop;
    event.clientHeight = nativeScrollEvent.target.clientHeight;

    return event;
  }

  isScrollingDown(event: ScrollEvent): boolean {
    return this.scrollTop < event.scrollTop;
  }

  isScrollMetExpectedPercentage(percent: number): boolean {
    return ((this.scrollTop + this.clientHeight) / this.scrollHeight) > (percent/100);
  }

  isOnTop(): boolean {
    return this.scrollTop === 0;
  }
}