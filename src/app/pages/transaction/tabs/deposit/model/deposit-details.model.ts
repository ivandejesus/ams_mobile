import { CustomerPaymentOption, CustomerPaymentOptionResponse, CustomerPaymentOptionDetailsResponse } from "../../../../../shared/model/customer-payment-option.model";
import { CustomerProductResponse, CustomerProduct } from "../../../../../shared/model/customer-products.model";

export interface DepositDetailsResponse {
  paymentOptions: CustomerPaymentOptionResponse[];
  customerProducts: CustomerProductResponse[];
  paymentOptionsDisplay: CustomerPaymentOptionDetailsResponse;
}

/**
 * Contains all necessary details that 
 * transaction needed.
 */
export class DepositDetails {
  customerPaymentOptions: CustomerPaymentOption[];  
  customerProducts: CustomerProduct[];

  static fromResponse(response: DepositDetailsResponse): DepositDetails {
    const depositDetails = new DepositDetails();

    // NOTE: response.paymentOptions returns all customer's available payment options and
    // payment options that is not available to him.
    depositDetails.customerPaymentOptions = response.paymentOptions.map((paymentOptionresponse: CustomerPaymentOptionResponse): CustomerPaymentOption => {
      return CustomerPaymentOption.fromResponse(paymentOptionresponse, response.paymentOptionsDisplay);
    });
    
    depositDetails.customerProducts = response.customerProducts.map((customerProductsResponse: CustomerProductResponse): CustomerProduct => {
      return CustomerProduct.fromResponse(customerProductsResponse);
    });

    return depositDetails;
  }
}