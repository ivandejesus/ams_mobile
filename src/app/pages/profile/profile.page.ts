import { Component, OnInit, ViewChild, ComponentFactoryResolver, AfterViewInit, ComponentRef } from '@angular/core';
import { SidenavService } from '../../shared/ui/sidenav.service';
import { SessionService } from '../../shared/security/session.service';
import { TabDirective } from '../../shared/ui/tab.directive';
import { AccountTab } from './tabs/account.tab';
import { KycTab } from './tabs/kyc.tab';
import { Session, User } from '../../shared/model/security/session.model';
import { Observable } from 'rxjs';
import { SettingsPage } from '../settings/settings.page';
import { OnsNavigator } from 'ngx-onsenui';
import { AccountActivationComponent } from "../settings/forms/account-activation/account-activation.component";
import { delay } from "rxjs/operators";
import { ChatService } from '../../shared/ws/chat.service';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'ons-page[profile]',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.css']
})
export class ProfilePage implements OnInit {

  @ViewChild(TabDirective) 
  tabHost: TabDirective;

  componentRef: ComponentRef<any>;
  user$: Observable<User>;
  amsSigninUrl: string = environment.amsSigninUrl;

  constructor(
    private navigator: OnsNavigator,
    private sessionService: SessionService, 
    private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnInit(): void {
    this.user$ = this.sessionService.getUser();
    this.user$
      .pipe(delay(1))
      .subscribe((user: User) => {
        this.showAccount();
    });
  }

  showAccount(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }

    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(AccountTab);
    let viewContainerRef = this.tabHost.viewContainerRef;
    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(componentFactory);
    (<AccountTab>this.componentRef.instance).user$ = this.user$;
  }

  showKyc(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }

    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(KycTab);
    let viewContainerRef = this.tabHost.viewContainerRef;
    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(componentFactory);
  }

  backtoDashboard(): void {
    this.navigator.element.popPage();
  }

  gotoSettings(): void {
    this.navigator.element.pushPage(SettingsPage);
  }

  gotoAccountActivation(): void {
    this.navigator.element.pushPage(AccountActivationComponent);
  }

  logout(): void {
    this.sessionService.logout().subscribe(() => {
      this.backtoDashboard();
      window.location.reload();
    });
  }
}
