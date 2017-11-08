import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Api } from './api';

@Injectable()
export class NoticeApi {

  constructor(public http: Http, public api: Api) {
  }

  query(endpoint:any,params?: any) {
    return this.api.get(endpoint, params)
      .map(resp => resp.json());
  }

}
