import { CustomerPaymentOption, CustomerPaymentOptionResponse, CustomerPaymentOptionDetailsResponse } from "../../../../../shared/model/customer-payment-option.model";
import { CustomerProductResponse, CustomerProduct } from "../../../../../shared/model/customer-products.model";

export interface WithdrawalDetailsResponse {
  paymentOptions: CustomerPaymentOptionResponse[];
  customerProducts: CustomerProductResponse[];
  paymentOptionsDisplay: CustomerPaymentOptionDetailsResponse;
}

/**
 * Contains all necessary details that 
 * transaction needed.
 */
export class WithdrawalDetails {
  customerPaymentOptions: CustomerPaymentOption[];  
  customerProducts: CustomerProduct[];

  static fromResponse(response: WithdrawalDetailsResponse): WithdrawalDetails {
    const withdrawalDetails = new WithdrawalDetails();

    // NOTE: response.paymentOptions returns all customer's available payment options and
    // payment options that is not available to him.
    withdrawalDetails.customerPaymentOptions = response.paymentOptions.map((paymentOptionresponse: CustomerPaymentOptionResponse): CustomerPaymentOption => {
      return CustomerPaymentOption.fromResponse(paymentOptionresponse, response.paymentOptionsDisplay);
    });
    
    withdrawalDetails.customerProducts = response.customerProducts.map((customerProductsResponse: CustomerProductResponse): CustomerProduct => {
      return CustomerProduct.fromResponse(customerProductsResponse);
    });

    return withdrawalDetails;
  }
}