export interface PaymentOptionResponse {
  id: number;
  type: string;
  is_active: boolean;
  fields: {
    notes: string;
    status: boolean;
    bank_name: string;
    swift_code: string;
    iban_number: string;
    bank_address: string
  }[]
}

export interface paymentOptionFilter {
  key: string;
  value: string;
}

export class PaymentOption {
  id: number;
  type: string;
  is_active: boolean;
  value: string;

  static fromResponse(response: PaymentOptionResponse) {
    const option = new PaymentOption();

    option.id = response.id;
    option.type = response.type;
    option.is_active = response.is_active;

    return option;
  }

}
