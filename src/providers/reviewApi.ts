import { Injectable } from '@angular/core';
import {  Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import { Api } from './api';
import { UserApi } from './userApi';

@Injectable()
export class ReviewApi {
  review:any;
  replys:any;
  constructor(public api: Api, public userApi:UserApi) {
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

  add(endpoint:any, params?:any, contentType?:any) {
    let myHeader = new Headers();
    if(this.userApi.token) {
        myHeader.append('X-Authorization',  'Bearer ' + this.userApi.token);
        if(contentType) {
          myHeader.append('Content-Type',  contentType);
        } else {
           myHeader.append('Content-Type',  'application/x-www-form-urlencoded');
        }
        
        endpoint = "v1/" + endpoint;
    }
    let opt: RequestOptions;
    opt = new RequestOptions({
            headers:myHeader
    });
    return this.api.post(endpoint, params, opt)
      .map(resp => resp.json());
  }

  delete(endpoint:any, params?:any, contentType?:any) {
    let myHeader = new Headers();
    if(this.userApi.token) {
        myHeader.append('X-Authorization',  'Bearer ' + this.userApi.token);
        if(contentType) {
          myHeader.append('Content-Type',  contentType);
        } else {
           myHeader.append('Content-Type',  'application/x-www-form-urlencoded');
        }
        
        endpoint = "v1/" + endpoint;
    }
    let opt: RequestOptions;
    opt = new RequestOptions({
            headers:myHeader
    });
    return this.api.delete(endpoint, opt)
      .map(resp => resp.json());
  }
}
