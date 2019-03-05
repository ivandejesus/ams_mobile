import { Component, OnInit, ViewChild, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { OnsNavigator, Params } from 'ngx-onsenui';
import { TabDirective } from '../../shared/ui/tab.directive';
import { DepositTab } from './tabs/deposit/deposit.tab';
import { WithdrawalTab } from './tabs/withdrawal/withdrawal.tab';
import { TransferTab } from './tabs/transfer/transfer.tab';
import { NotificationPage } from '../notification/notification.page';
import { NotificationApi } from '../../shared/api/service/notification.api';

@Component({
  selector: 'ons-page[transaction]',
  templateUrl: './transaction.page.html',
  styleUrls: ['./transaction.page.css']
})
export class TransactionPage implements OnInit {

  @ViewChild(TabDirective)
  tabHost: TabDirective;
  componentRef: ComponentRef<any>;

  constructor(
    private navigator: OnsNavigator, 
    private componentFactoryResolver: ComponentFactoryResolver, 
    public notificationApi: NotificationApi,
    private params: Params) {
  }

  ngOnInit(): void {
    switch (this.params.data.type) {
      case 'deposit': 
        this.showDeposit();
        break;
      case 'withdrawal': 
        this.showWithdrawal();
        break;
      case 'transfer':
        this.showTransfer();
        break;
    } 
  }

  showDeposit(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }

    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(DepositTab);
    let viewContainerRef = this.tabHost.viewContainerRef;
    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(componentFactory);

    document.querySelector('.tabbar__item[name=deposit] .tabbar__button').classList.add('active');
    document.querySelector('.tabbar__item[name=withdrawal] .tabbar__button').classList.remove('active');
    document.querySelector('.tabbar__item[name=transfer] .tabbar__button').classList.remove('active');
  }

  showWithdrawal(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }

    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(WithdrawalTab);
    let viewContainerRef = this.tabHost.viewContainerRef;
    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(componentFactory);

    document.querySelector('.tabbar__item[name=deposit] .tabbar__button').classList.remove('active');
    document.querySelector('.tabbar__item[name=withdrawal] .tabbar__button').classList.add('active');
    document.querySelector('.tabbar__item[name=transfer] .tabbar__button').classList.remove('active');
  }

  showTransfer(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }

    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(TransferTab);
    let viewContainerRef = this.tabHost.viewContainerRef;
    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(componentFactory);

    document.querySelector('.tabbar__item[name=deposit] .tabbar__button').classList.remove('active');
    document.querySelector('.tabbar__item[name=withdrawal] .tabbar__button').classList.remove('active');
    document.querySelector('.tabbar__item[name=transfer] .tabbar__button').classList.add('active');
  }

  gotoNotification(): void {
    this.navigator.element.pushPage(NotificationPage);
  }
}
