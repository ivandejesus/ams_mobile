import { Component, OnInit, ViewChild, ComponentFactoryResolver, AfterViewInit, ComponentRef } from '@angular/core';
import { OnsNavigator } from 'ngx-onsenui';
import { TabDirective } from '../../shared/ui/tab.directive';
import { SkypeOutstandingTab } from './tabs/skype-betting-outstanding.tab';
import { SkypeBettingHistoryTab } from './tabs/skype-betting-history.tab';
import { SkypeBettingOverviewTab } from './tabs/skype-betting-overview.tab';
import { NotificationPage } from '../notification/notification.page';
import { NotificationApi } from '../../shared/api/service/notification.api';

@Component({
    selector: 'ons-page[skypeBetting]',
    templateUrl: './skype-betting.page.html',
    styleUrls: ['./skype-betting.page.css']
})
export class  SkypeBettingPage implements OnInit {

  @ViewChild(TabDirective) 
  tabHost: TabDirective;

  componentRef: ComponentRef<any>;

  constructor(
    private navigator: OnsNavigator, 
    public notificationApi: NotificationApi,
    private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnInit(): void {
    this.showOutstandingBets();
  }

  showOutstandingBets(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }

    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(SkypeOutstandingTab);
    let viewContainerRef = this.tabHost.viewContainerRef;
    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(componentFactory);
  }

  showBetHistory(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }

    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(SkypeBettingHistoryTab);
    let viewContainerRef = this.tabHost.viewContainerRef;
    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(componentFactory);
  }

  showBetOverview(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }

    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(SkypeBettingOverviewTab);
    let viewContainerRef = this.tabHost.viewContainerRef;
    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(componentFactory);
  }

  gotoNotification(): void {
    this.navigator.element.pushPage(NotificationPage);
  }
}
