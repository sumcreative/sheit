import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment';
// declare var moment:any;
/**
 * Generated class for the DateformatPipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'dateformat',
})
export class DateformatPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
transform(date:any, format: string) {
     let pDate = moment(date);
    return pDate.format(format);
  }
}
