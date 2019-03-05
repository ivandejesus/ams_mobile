export interface ProductResponse {
  id: number;
  name: string;
  code: string;
}

export class Product {
  id: number;
  name: string;
  code: string;

  static fromResponse(response: ProductResponse): Product {
    const product = new Product();

    product.id = response.id;
    product.name = response.name;
    product.code = response.code;

    return product;
  }
}
