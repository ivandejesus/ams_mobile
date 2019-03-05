import { Injectable, ComponentFactoryResolver } from '@angular/core';
import { ToastComponent } from './toast.component';
import { ToastDirective } from './toast.directive';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable()
export class ToastService {
  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  success(host: ToastDirective, title: string, message: string): void {
    this.createComponentRef(host, 'success', title, message);
  }

  warning(host: ToastDirective, title: string, message: string): void {
    this.createComponentRef(host, 'warning', title, message);
  }

  danger(host: ToastDirective, title: string, message: string): void {
    this.createComponentRef(host, 'danger', title, message);
  }

  general(host: ToastDirective, title: string, message: string): void {
    this.createComponentRef(host, 'general', title, message);
  }

  createComponentRef(host: ToastDirective, type: string, title: string, message: string): void {
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(ToastComponent);
    let viewContainerRef = host.viewContainerRef;
    
    let component = viewContainerRef.createComponent(componentFactory);

    (<ToastComponent>component.instance).type = type;
    (<ToastComponent>component.instance).title = title;
    (<ToastComponent>component.instance).message = message;
    
    const timeout = of('').pipe(
      delay(5000)
    );

    const subscription = timeout.subscribe(() => {
      component.destroy();
      subscription.unsubscribe();
    });
  }
}
