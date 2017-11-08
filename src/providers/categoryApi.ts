import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { Api } from './api';

@Injectable()
export class CategoryApi {
  sideBanner:any = [];
  grdCtg:any = [];
  sideCategory:any;
  category:any;
  homeCategory:any;
  constructor( public api: Api) {
  }

  query(endpoint:any,params?: any) {
    return this.api.get(endpoint, params)
      .map(resp => resp.json());
  }

  getCategory(endpoint:any, params?:any) {
    return this.api.get(endpoint, params)
      .map(resp => resp.json());
  }

}
