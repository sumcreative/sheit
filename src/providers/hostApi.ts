import { Injectable } from '@angular/core';
import {  Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import { Api } from './api';
import { UserApi } from './userApi';

@Injectable()
export class HostApi {
  brand:any;
  reviews:any = [];
  
  constructor( public api: Api, public userApi:UserApi) {
  }

  query(endpoint:any,params?: any) {
     if(this.userApi.token) {
      let myHeader = new Headers();
      myHeader.append('X-Authorization',  'Bearer ' + this.userApi.token);
      let opt: RequestOptions;
      opt = new RequestOptions({
              headers:myHeader
      });
      
       return this.api.get("v1/" + endpoint, params, opt)
      .map(resp => resp.json());
    } else {
       return this.api.get(endpoint, params)
      .map(resp => resp.json());
    }
  }

}
