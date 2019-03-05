import { Injectable, ComponentFactoryResolver } from '@angular/core';
import { AlertComponent } from './alert.component';
import { AlertDirective } from './alert.directive';
import { take } from 'rxjs/operators';

export interface AlertOptions {
  title?: string;
  message: string;
  subMessage?: string;
  cancelable?: boolean;
}

@Injectable()
export class AlertService {
  host: AlertDirective;
  
  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  setHost(host: AlertDirective): void {
    this.host = host;
  }
  
  success(options: AlertOptions, callback?: Function): void {
    this.createComponentRef('success', options, callback);
  }
  
  danger(options: AlertOptions, callback?: Function): void {
    this.createComponentRef('danger', options, callback);
  }
  
  warning(options: AlertOptions, callback?: Function): void {
    this.createComponentRef('warning', options, callback);
  }
  
  okCancel(options: AlertOptions, callback?: Function): void {
    this.createComponentRef('okCancel', options, callback);
  }
  
  successActivation(options: AlertOptions, callback?: Function): void {
    this.createComponentRef('activation', options, callback);
  }

  defaultPopover(options: AlertOptions, callback?: Function): void {
    this.createComponentRef('popover', options, callback);
  }

  createComponentRef(type: string, options: AlertOptions, callback?: Function): void {
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    let viewContainerRef = this.host.viewContainerRef;
    
    let component = viewContainerRef.createComponent(componentFactory);

    (<AlertComponent>component.instance).type = type;
    (<AlertComponent>component.instance).callback = callback;
    (<AlertComponent>component.instance).title = options.title;
    (<AlertComponent>component.instance).message = options.message;
    (<AlertComponent>component.instance).subMessage = options.subMessage;
    (<AlertComponent>component.instance).cancelable = options.cancelable;

    (<AlertComponent>component.instance).destroy$
    .pipe(
      take(2)
    )
    .subscribe((action: string) => {
      if (action == 'destroy') {
        component.destroy();
      }
    });
  }
}
