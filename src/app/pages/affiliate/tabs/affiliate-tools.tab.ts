import { Component, OnInit, ComponentFactoryResolver, AfterViewInit, ViewChild, ComponentRef } from '@angular/core';
import { OnsNavigator } from 'ngx-onsenui';

import { TabDirective } from '../../../shared/ui/tab.directive';
import { AffiliateGenerateTab } from './tabs/affiliate-generate.tab';
import { AffiliateArchiveTab } from './tabs/affiliate-archive.tab';

@Component({
    selector: 'tab[affiliate-tools]',
    templateUrl: './affiliate-tools.tab.html',
    styleUrls: ['./affiliate-tools.tab.css']
})
export class AffiliateToolsTab implements OnInit, AfterViewInit {
  @ViewChild(TabDirective)
  innerTabHost: TabDirective;

  innerComponentRef: ComponentRef<any>;

  constructor(private navigator: OnsNavigator, private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnInit(): void {
    this.showArchiveTab();
  }

  ngAfterViewInit() {
  }

  showGenerateTab(): void {
    if (this.innerComponentRef) {
      this.innerComponentRef.destroy();
    }

    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(AffiliateGenerateTab);
    let viewContainerRef = this.innerTabHost.viewContainerRef;
    viewContainerRef.clear();

    this.innerComponentRef = viewContainerRef.createComponent(componentFactory);
  }

  showArchiveTab(): void {
    if (this.innerComponentRef) {
      this.innerComponentRef.destroy();
    }

    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(AffiliateArchiveTab);
    let viewContainerRef = this.innerTabHost.viewContainerRef;
    viewContainerRef.clear();

    this.innerComponentRef = viewContainerRef.createComponent(componentFactory);
  }
}
