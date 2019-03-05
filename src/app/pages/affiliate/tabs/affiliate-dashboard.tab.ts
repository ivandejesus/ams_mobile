import { Component, OnInit, ComponentFactoryResolver, AfterViewInit, ViewChild, ComponentRef } from '@angular/core';
import { OnsNavigator } from 'ngx-onsenui';

import { TabDirective } from '../../../shared/ui/tab.directive';
import { AffiliateProductTab } from './tabs/affiliate-product.tab';
import { AffiliateMemberTab } from './tabs/affiliate-member.tab';

@Component({
    selector: 'tab[affiliate-dashboard]',
    templateUrl: './affiliate-dashboard.tab.html',
    styleUrls: ['./affiliate-dashboard.tab.css']
})
export class AffiliateDashboardTab implements OnInit, AfterViewInit {
  @ViewChild(TabDirective)
  innerTabHost: TabDirective;

  innerComponentRef: ComponentRef<any>;

  constructor(private navigator: OnsNavigator, private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnInit(): void {
    this.showProductTab();
  }

  ngOnDestroy(): void {
  }

  ngAfterViewInit() {
  }

  showProductTab(): void {
    if (this.innerComponentRef) {
      this.innerComponentRef.destroy();
    }

    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(AffiliateProductTab);
    let viewContainerRef = this.innerTabHost.viewContainerRef;
    viewContainerRef.clear();

    this.innerComponentRef = viewContainerRef.createComponent(componentFactory);
  }

  showMemberTab(): void {
    if (this.innerComponentRef) {
      this.innerComponentRef.destroy();
    }

    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(AffiliateMemberTab);
    let viewContainerRef = this.innerTabHost.viewContainerRef;
    viewContainerRef.clear();

    this.innerComponentRef = viewContainerRef.createComponent(componentFactory);
  }
}
