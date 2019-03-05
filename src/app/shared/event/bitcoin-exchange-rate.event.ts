import { Event } from "./event";
import { BitcoinExchangeRate } from "../model/bitcoin-exchange-rate.model";

export class BitcoinExchangeRateEvent extends Event {
  static NAME: string = 'event.bitcoin-rate-exchange';

  bitcoinExchangeRate: BitcoinExchangeRate;

  constructor(payload: any) {
    super(payload, BitcoinExchangeRateEvent.NAME);

    this.bitcoinExchangeRate = BitcoinExchangeRate.fromResponse(payload);
  }
}