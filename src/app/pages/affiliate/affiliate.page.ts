import { Component, OnInit, ViewChild, ComponentFactoryResolver, AfterViewInit, ComponentRef } from '@angular/core';
import { OnsNavigator } from 'ngx-onsenui';
import { TabDirective } from '../../shared/ui/tab.directive';
import { AffiliateDashboardTab } from './tabs/affiliate-dashboard.tab';
import { AffiliateToolsTab } from './tabs/affiliate-tools.tab';
import { NotificationPage } from '../notification/notification.page';
import { NotificationApi } from '../../shared/api/service/notification.api';

@Component({
    selector: 'ons-page[affiliate]',
    templateUrl: './affiliate.page.html',
    styleUrls: ['./affiliate.page.css']
})
export class AffiliatePage implements OnInit, AfterViewInit {
  @ViewChild(TabDirective) 
  tabHost: TabDirective;

  componentRef: ComponentRef<any>;

  constructor(
    private navigator: OnsNavigator, 
    private componentFactoryResolver: ComponentFactoryResolver,
    public notificationApi: NotificationApi) {
  }

  ngOnInit(): void {
  
  }

  ngAfterViewInit() {
    this.showDashboard();
  }

  showDashboard(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }

    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(AffiliateDashboardTab);
    let viewContainerRef = this.tabHost.viewContainerRef;
    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(componentFactory);
  }

  showTools(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }

    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(AffiliateToolsTab);
    let viewContainerRef = this.tabHost.viewContainerRef;
    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(componentFactory);
  }

  gotoNotification(): void {
    this.navigator.element.pushPage(NotificationPage);
  }
}
