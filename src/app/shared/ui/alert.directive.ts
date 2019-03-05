import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[alertHost]',
})
export class AlertDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}