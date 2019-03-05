import { Pipe, PipeTransform } from "ngx-onsenui";
import Decimal from "decimal.js";
import { format } from "../decimal.util";

@Pipe({name: 'format'})
export class DecimalFormatPipe implements PipeTransform {
  transform(value: Decimal, decimalPlaces: number = 2, shouldAddComma: boolean = true): string {
    return format(value, decimalPlaces, shouldAddComma);
  }
}
