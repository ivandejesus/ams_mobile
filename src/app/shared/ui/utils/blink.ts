import { of } from "rxjs";
import { tap, delay, take } from "rxjs/operators";

export function blink(elementId: string): void {
  const element = document.getElementById(elementId);
    
  of('').pipe(
    tap(() => {
      element.classList.add('blinking');
    }),
    delay(3500),
    take(1)
  ).subscribe(() => {
    element.classList.remove('blinking');
  }); 
}