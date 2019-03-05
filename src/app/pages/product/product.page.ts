import { Component, OnInit } from '@angular/core';
import { OnsNavigator } from 'ngx-onsenui';
import { CreateProductPage } from './create-product.page';
import { CustomerApi } from '../../shared/api/service/customer.api';
import { CustomerProduct } from '../../shared/model/customer-products.model';
import { EventDispatcherService } from '../../shared/event/event-dispatcher.service';
import { Observable } from 'rxjs';
import { Event } from '../../shared/event/event';

@Component({
  selector: 'ons-page[product]',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.css']
})
export class ProductPage implements OnInit {

  customerProducts$: Observable<CustomerProduct[]>;

  constructor(
    private navigator: OnsNavigator,
    private customerApi: CustomerApi,
    private dispatcherService: EventDispatcherService,
  ) { }

  ngOnInit() {
    this.customerProducts$ = this.customerApi.getCustomerProducts();

    this.dispatcherService.event$.subscribe((event: Event) => {
      this.customerProducts$ = this.customerApi.getCustomerProducts();
    });
  }

  gotoCreateProduct(): void {
    this.navigator.element.pushPage(CreateProductPage);
  }
}
