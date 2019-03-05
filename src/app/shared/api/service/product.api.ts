import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpService } from '../http/http.service';
import { map, shareReplay } from 'rxjs/operators';
import { Product, ProductResponse } from "../../model/product.model";

@Injectable()
export class ProductApi {
  constructor(private httpService: HttpService) {

  }

  getProducts(): Observable<Product[]> {
    const makeProducts = map((response: ProductResponse[]): Array<Product> => {
      return response.map((productResponse: ProductResponse): Product => {
        return Product.fromResponse(productResponse);
      });
    });

    return this.httpService.get('/products').pipe(
      makeProducts,
      shareReplay(),
    );
  }
}
