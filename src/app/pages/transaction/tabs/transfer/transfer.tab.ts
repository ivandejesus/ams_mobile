import { Component, OnInit, ComponentFactoryResolver, ViewChild, ComponentRef } from '@angular/core';
import { Observable } from "rxjs";

import { TabDirective } from '../../../../shared/ui/tab.directive';
import { ProductWalletComponent } from './tabs/product-wallet/product-wallet.component';
import { PeerToPeerComponent } from './tabs/peer-to-peer/peer-to-peer.component';
import { CustomerProduct } from "../../../../shared/model/customer-products.model";
import { CustomerApi } from "../../../../shared/api/service/customer.api";
import { Product } from "../../../../shared/model/product.model";
import { ProductApi } from "../../../../shared/api/service/product.api";
import { TransactionHistoryPage } from 'src/app/pages/transaction-history/transaction-history.page';
import { OnsNavigator } from 'ngx-onsenui';
import { TransactionComponent } from '../../../../shared/component/transaction.component';
import { combineLatest, take } from 'rxjs/operators';
import { User } from '../../../../shared/model/security/session.model';

@Component({
  selector: 'tab[transfer]',
  templateUrl: './transfer.tab.html',
  styleUrls: ['./transfer.tab.css']
})
export class TransferTab extends TransactionComponent implements OnInit {
  @ViewChild(TabDirective)
  innerTabHost: TabDirective;

  innerComponentRef: ComponentRef<any>;
  customerProducts$: Observable<CustomerProduct[]>;
  products$: Observable<Product[]>;

  constructor(
      private componentFactoryResolver: ComponentFactoryResolver,
      private customerApi: CustomerApi,
      private productApi: ProductApi,
      private navigator: OnsNavigator
  ) {
    super();
  }

  ngOnInit(): void {
    this.customerProducts$ = this.customerApi.getCustomerProducts();
    this.products$ = this.productApi.getProducts();
    this.showProductWallet();
  }


  showProductWallet(): void {
    if (this.innerComponentRef) {
      this.innerComponentRef.destroy();
    }

    this.customerProducts$.subscribe((customerProducts: CustomerProduct[]) => {
      let componentFactory = this.componentFactoryResolver.resolveComponentFactory(ProductWalletComponent);
      let viewContainerRef = this.innerTabHost.viewContainerRef;
      viewContainerRef.clear();
      
      this.innerComponentRef = viewContainerRef.createComponent(componentFactory);
      (<ProductWalletComponent>this.innerComponentRef.instance).customerProducts = customerProducts;
    });
  }

  showPeerToPeer(): void {
    if (this.innerComponentRef) {
      this.innerComponentRef.destroy();
    }

    this.customerProducts$.pipe(
      combineLatest(this.products$, this.user$),
      take(1)
    ).subscribe((result: any) => {
      const user: User = <User>result[2];
      const products: Product[] = <Product[]>result[1];
      const customerProducts: CustomerProduct[] = <CustomerProduct[]>result[0];

      if (user.isVerified) {
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(PeerToPeerComponent);
        let viewContainerRef = this.innerTabHost.viewContainerRef;
        viewContainerRef.clear();

        this.innerComponentRef = viewContainerRef.createComponent(componentFactory);
        (<PeerToPeerComponent>this.innerComponentRef.instance).products = products;
        (<PeerToPeerComponent>this.innerComponentRef.instance).customerProducts = customerProducts;
      }
    });
  }

  gotoTransactionHistory(): void {
    this.navigator.element.pushPage(TransactionHistoryPage);
  }
}
