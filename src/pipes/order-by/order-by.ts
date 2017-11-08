import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
/**
 * Generated class for the OrderByPipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'orderBy',
})
export class OrderByPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(array, args) {
    console.log(args);
    return _.orderBy(array, args, 'desc') ;
  }
}
