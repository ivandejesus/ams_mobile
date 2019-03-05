import { Component, Input, inject } from "ngx-onsenui";
import { CustomerPaymentOption } from "../model/customer-payment-option.model";
import { CustomerProduct } from "../model/customer-products.model";

import { BaseComponent } from "./base.component";

@Component({
  template: ``
})
export class TransactionComponent extends BaseComponent {
  @Input()
  customerPaymentOption: CustomerPaymentOption;

  @Input()
  customerProducts: CustomerProduct[];
  chosenCustomerProducts: any[] = [];
  
  form: any;

  constructor() {
    super();
  }

  onProductChange(newValue, oldValue, idx: number): void {
    const findInChosenProducts = (item) => {
      return item.value === oldValue && item.index === idx;
    }

    const index = this.chosenCustomerProducts.findIndex(findInChosenProducts);
    
    if (index > -1) {
      this.chosenCustomerProducts.splice(index, 1);
    }

    this.chosenCustomerProducts.push({value: newValue, index: idx});
  }

  isInChosenProducts(customerProduct: CustomerProduct): boolean {
    return this.chosenCustomerProducts.find((item: any) => {
      return item.value === customerProduct.id;
    }) ? true : false;
  }

  // This higher order function evaluates condition if true
  // then execute the callback. By having this function
  // we can then minimize using ifs on our components.
  should(condition: boolean, callback: Function): void {
    if (condition) {
      callback();
    }

    // Do nothing if false.
  }
  
  resetForm(): void {
    this.chosenCustomerProducts.length = 0;
    this.form.reset(); 
  }

  removeSubtransaction(index: number): void {
    const subtransaction = this.form.getSubtransaction(index).value;
    
    this.chosenCustomerProducts = this.chosenCustomerProducts.filter(item => {
      return subtransaction.product !== item.value;
    });

    this.form.removeSubtransaction(index);
  }
}