import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import { Api } from './api';

@Injectable()
export class UserApi {
  token:any;
  user:any;
  
  constructor(public http: Http, public api: Api) {
  }

  query(endpoint:any,params?: any) {
      let myHeader = new Headers();
      if(this.token) {
          myHeader.append('X-Authorization',  'Bearer ' + this.token);
      }
      
      let opt: RequestOptions;
      opt = new RequestOptions({
              headers:myHeader
      });
    return this.api.get(endpoint, params, opt)
      .map(resp => resp.json());
  }

  login(endpoint:any, userProfile) {
    let myHeader = new Headers();
    myHeader.append("x-requested-with", "XMLHttpRequest");
    myHeader.append("Content-Type", "application/json");
    let opt: RequestOptions;
    opt = new RequestOptions({
            headers:myHeader
    });
    //  let body = {"username": username, "password":password};
    return this.api.post(endpoint, userProfile, opt)
      .map(resp => resp.json());
  }

  join(endpoint:any, body) {
            let headers = new Headers();
            headers.append("Content-Type", "application/json");
                let opt: RequestOptions;
              opt = new RequestOptions({
                      headers:headers
              });
      return this.api.post(endpoint, body, opt)
        .map(resp => resp.json());
  }

  update(endpoint:any,params?: any) {
    if(this.token) {
      let myHeader = new Headers();
      myHeader.append('X-Authorization',  'Bearer ' + this.token);
      myHeader.append("Content-Type", "application/json");
      let opt: RequestOptions;
      opt = new RequestOptions({
              headers:myHeader
      });
      
       return this.api.put("v1/" + endpoint, params, opt)
      .map(resp => resp.json());
    } else {
       return this.api.put(endpoint, params)
      .map(resp => resp.json());
    }
   
  }
}
