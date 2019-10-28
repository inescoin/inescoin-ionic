import { Pipe, PipeTransform } from '@angular/core';

import { inescoinConfig } from '../../config/inescoin.config';

@Pipe({
  name: 'cryptoAmount'
})
export class CryptoAmountPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value / inescoinConfig.unit;
  }
}
