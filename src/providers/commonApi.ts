import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import { Api } from './api';
import { UserApi } from './userApi';

@Injectable()
export class CommonApi {
   lat:any = 37.566826;
  lng:any = 126.9786567;
  accuracy:any=0;
  constructor(public http: Http, public api: Api, public userApi:UserApi) {
  }

  query(endpoint:any,params?: any) {
          let myHeader = new Headers();
      if(this.userApi.token) {
          myHeader.append('X-Authorization',  'Bearer ' + this.userApi.token);
          myHeader.append('Content-Type',  'application/x-www-form-urlencoded');
          endpoint = "v1/" + endpoint;
      }
      
      let opt: RequestOptions;
      opt = new RequestOptions({
              headers:myHeader
      });
    return this.api.get(endpoint, params, opt)
      .map(resp => resp.json());
  }

  add(endpoint:any, params?:any) {
    let myHeader = new Headers();
          if(this.userApi.token) {
          myHeader.append('X-Authorization',  'Bearer ' + this.userApi.token);
          myHeader.append('Content-Type',  'application/x-www-form-urlencoded');
          endpoint = "v1/" + endpoint;
      }
    let opt: RequestOptions;
    opt = new RequestOptions({
            headers:myHeader
    });
    return this.api.post(endpoint, params, opt)
      .map(resp => resp.json());
  }

  update(endpoint:any, params?:any) {
              let myHeader = new Headers();
      if(this.userApi.token) {
          myHeader.append('X-Authorization',  'Bearer ' + this.userApi.token);
          endpoint = "v1/" + endpoint;
      }
      
      let opt: RequestOptions;
      opt = new RequestOptions({
              headers:myHeader
      });

      return this.api.put(endpoint, params, opt)
      .map(resp => resp.json());
  }

  delete(endpoint:any) {
                    let myHeader = new Headers();
      if(this.userApi.token) {
          myHeader.append('X-Authorization',  'Bearer ' + this.userApi.token);
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
