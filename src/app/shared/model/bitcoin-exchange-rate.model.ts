import { Decimal, ZERO, BITCOIN_DECIMAL_PLACES, inBetween } from '../number.util';

export interface BitcoinExchangeRateResponse {
  adjusted_base_rate: string;
  latest_base_rate: string;
  conversion_table: RateSettingResponse[];
  bitcoin_config: BitcoinConfigResponse;
  type: string;
}

export interface RateSettingResponse {
  is_default: boolean;
  fixed_adjustment: string;
  percent_adjustment: string;
  range_start: string;
  range_end: string;
}

export interface BitcoinConfigResponse {
  minimumAllowedDeposit: string;
  maximumAllowedDeposit: string;
  minimumAllowedWithdrawal: string;
  maximumAllowedWithdrawal: string;
}

export class BitcoinExchangeRate {
  adjustedRate: Decimal;

  private adjustedBaseRate: Decimal;
  latestBaseRate: Decimal;
  rateSettings: RateSetting[];
  type: string;

  config: BitcoinConfig;

  static fromResponse(response: BitcoinExchangeRateResponse): BitcoinExchangeRate {
    const btcExchangeRate = new BitcoinExchangeRate();

    btcExchangeRate.config = BitcoinConfig.fromResponse(response.bitcoin_config);

    btcExchangeRate.adjustedBaseRate = new Decimal(response.adjusted_base_rate, BITCOIN_DECIMAL_PLACES);
    btcExchangeRate.latestBaseRate = new Decimal(response.latest_base_rate, BITCOIN_DECIMAL_PLACES);

    btcExchangeRate.type = response.type;

    btcExchangeRate.rateSettings = response.conversion_table.map((rateSettingResponse: RateSettingResponse): RateSetting => {
      return RateSetting.fromResponse(rateSettingResponse, btcExchangeRate.latestBaseRate, btcExchangeRate.type);
    });

    btcExchangeRate.adjustedRate = btcExchangeRate.initialRate;

    return btcExchangeRate;
  }

  get initialRate(): Decimal {
    const getDefaultRateSetting = this.getDefaultRateSetting();

    return getDefaultRateSetting.computeAdjustedRate(this.latestBaseRate);
  }

  private getDefaultRateSetting(): RateSetting {
    return this.rateSettings.filter(setting => setting.isDefault)[0];
  }

  adjustRateBasedOnTotalBtc(totalBtc: Decimal): void {
    const rateSetting = this.getRateSettingBasedOnTotalBtc(totalBtc);

    this.adjustedRate = rateSetting.computeAdjustedRate(this.latestBaseRate);
  }

  getRateSettingBasedOnTotalBtc(totalBtc: Decimal): RateSetting {
    const rateSetting = this.rateSettings.filter((setting: RateSetting) => {
      return inBetween(totalBtc, setting.rangeStart, setting.rangeEnd);
    });

    if (rateSetting.length < 1) {
      return this.getDefaultRateSetting();
    }

    return rateSetting[0];
  }

  adjustRateBasedOnTotalAmount(totalAmount: Decimal): void {
    const rateSetting = this.getRateSettingBasedOnTotalAmount(totalAmount);

    this.adjustedRate = rateSetting.computeAdjustedRate(this.latestBaseRate);
  }

  getRateSettingBasedOnTotalAmount(totalAmount: Decimal): RateSetting {
    const rateSetting = this.rateSettings.filter((setting: RateSetting) => {
      return inBetween(totalAmount, setting.rangeAmountStart, setting.rangeAmountEnd);
    });

    if (rateSetting.length < 1) {
      return this.getDefaultRateSetting();
    }

    return rateSetting[0];
  }

  isDeposit(): boolean {
    return this.type === 'deposit';
  }

  isWithdrawal(): boolean {
    return this.type === 'withdrawal';
  }
}

export class RateSetting {
  isDefault: boolean;
  fixedAdjustment: Decimal | null;
  percentAdjustment: Decimal | null;
  rangeStart: Decimal;
  rangeEnd: Decimal;
  type: string;

  // Used to convert actual amount into btc value.
  rangeAmountStart: Decimal;
  rangeAmountEnd: Decimal;

  static fromResponse(response: RateSettingResponse, latestBaseRate: Decimal, type: string): RateSetting {
    const rateSetting = new RateSetting();

    rateSetting.isDefault = response.is_default;
    rateSetting.fixedAdjustment = response.fixed_adjustment === null ? null : new Decimal(response.fixed_adjustment, BITCOIN_DECIMAL_PLACES);
    rateSetting.percentAdjustment = response.percent_adjustment === null ? null : new Decimal(response.percent_adjustment, BITCOIN_DECIMAL_PLACES);
    rateSetting.rangeStart = new Decimal(response.range_start === null ? ZERO: response.range_start, BITCOIN_DECIMAL_PLACES);
    rateSetting.rangeEnd = new Decimal(response.range_end === null ? ZERO: response.range_end, BITCOIN_DECIMAL_PLACES);
    rateSetting.type = type;

    const baseRate = rateSetting.computeAdjustedRate(latestBaseRate);

    rateSetting.rangeAmountStart = new Decimal(baseRate.valueOf() * rateSetting.rangeStart.valueOf());
    rateSetting.rangeAmountEnd = new Decimal(baseRate.valueOf() * rateSetting.rangeEnd.valueOf());

    return rateSetting;
  }

  computeAdjustedRate(latestBaseRate: Decimal): Decimal {
    if (this.fixedAdjustment !== null) {
      return this.computeByFixedAdjustment(latestBaseRate);
    }

    if (this.percentAdjustment !== null) {
      return this.computeByPercentageAdjustment(latestBaseRate);
    }

    throw 'Code should not go here!';
  }

  computeByFixedAdjustment(latestBaseRate: Decimal): Decimal {
    const adjusted = new Decimal(latestBaseRate, BITCOIN_DECIMAL_PLACES);

    if (this.type === 'deposit') {
      adjusted.sub(this.fixedAdjustment);
    } else {
      adjusted.plus(this.fixedAdjustment);
    }

    return adjusted;
  }

  computeByPercentageAdjustment(latestBaseRate: Decimal): Decimal {
    const adjustment = new Decimal(latestBaseRate.valueOf() * (this.percentAdjustment.valueOf() / 100));

    if (this.type === 'deposit') {
      return latestBaseRate.sub(adjustment);
    } else {
      return latestBaseRate.plus(adjustment);
    }
  }

  get adjustmentType(): string {
    if (this.fixedAdjustment !== null) { 
      return 'fixed';
    }

    if (this.percentAdjustment !== null) {
      return 'percentage';
    }

    throw 'Code should not go here.';
  }

  getAdjustment(latestBaseRate: Decimal): number {
    if (this.adjustmentType === 'fixed') {
      return this.fixedAdjustment.valueOf();
    }

    if (this.adjustmentType === 'percentage') {
      return latestBaseRate.valueOf() * (this.percentAdjustment.valueOf() / 100);
    }

    throw 'Code should not go here.';
  }

  get meta(): any {
    return {
      rangeStart: this.rangeStart.valueOf(),
      rangeEnd: this.rangeEnd.valueOf(),
      rangeAmountStart: this.rangeAmountStart.valueOf(),
      rangeAmountEnd: this.rangeAmountEnd.valueOf()
    }
  }
}

export class BitcoinConfig {
  minimumAllowedDeposit: string;
  maximumAllowedDeposit: string;
  minimumAllowedWithdrawal: string;
  maximumAllowedWithdrawal: string;

  static fromResponse(response: BitcoinConfigResponse): BitcoinConfig {
    const config = new BitcoinConfig();

    config.minimumAllowedDeposit = response.minimumAllowedDeposit;
    config.maximumAllowedDeposit = response.maximumAllowedDeposit;
    config.minimumAllowedWithdrawal = response.minimumAllowedWithdrawal;
    config.maximumAllowedWithdrawal = response.maximumAllowedWithdrawal;

    return config;
  }
}