import { Injectable } from "ngx-onsenui";
import { Observable } from "rxjs";
import { HttpService } from "../http/http.service";
import { PaymentOption , PaymentOptionResponse} from "../../model/payment-option.model";
import { map, shareReplay } from "rxjs/operators";
import { BitcoinExchangeRateResponse, BitcoinExchangeRate } from "../../model/bitcoin-exchange-rate.model";

@Injectable()
export class PaymentOptionApi {
  constructor(private httpService: HttpService) { }

  getPaymentOptions(): Observable<PaymentOption[]> {
    const makeFilterList = map((response: PaymentOptionResponse[]): PaymentOption[] => {
      return response.map((r) => PaymentOption.fromResponse(r));
    });

    return this.httpService.get(`/customer/payment-options`).pipe(
      makeFilterList,
      shareReplay(),
    );
  }

  getBitcoinExchangeRate(): Observable<BitcoinExchangeRate> {
    const mapExchangeRate = map((response: BitcoinExchangeRateResponse): BitcoinExchangeRate => {
      return BitcoinExchangeRate.fromResponse(response);
    });

    return this.httpService.get(`/payment-option/bitcoin-adjustment`).pipe(
      mapExchangeRate,
      shareReplay(),
    );
  }

  getWithdrawalBitcoinExchangeRate(): Observable<BitcoinExchangeRate> {
    const mapExchangeRate = map((response: BitcoinExchangeRateResponse): BitcoinExchangeRate => {
      return BitcoinExchangeRate.fromResponse(response);
    });

    return this.httpService.get(`/payment-option/bitcoin-withdrawal-adjustment`).pipe(
      mapExchangeRate,
      shareReplay(),
    );
  }
}
