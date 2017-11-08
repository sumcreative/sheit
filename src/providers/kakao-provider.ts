import {Injectable} from '@angular/core';
import {Platform} from 'ionic-angular';
import 'rxjs/add/operator/map';
declare var KakaoTalk:any;

@Injectable()
export class KakaoProvider {
    email:string;
    phone:string;
    name:string;

    constructor(private platform:Platform) {
        console.log("KakaoProvider");
    }

  login(){
    return new Promise((resolve,reject)=>{
         this.kakaologin(this).then((res:any)=>{
              resolve(res);
          }, (err)=>{
              reject(err);
          });
      });
  }

   kakaologin(kakaoProvider){
         return new Promise((resolve,reject)=>{
            if(this.platform.is("android") || this.platform.is('ios')) {
                KakaoTalk.login(
                    (userProfile)=>{
                        console.log("userProfile:"+JSON.stringify(userProfile));
                        var id;
                        if(typeof userProfile === "string"){
                            id=userProfile;
                        }else{ // humm... userProfile data type changes. Why?
                            id=userProfile.id;
                        }
                        console.log('Successful kakaotalk login with'+id);
                        resolve(userProfile);
                    },
                    (err)=> {
                        console.log('Error logging in');
                        console.log(JSON.stringify(err));
                        let reason={stage:"login_err",msg:err}; 
                        reject(reason);
                    }
                    
                ); 
            }
      });
  }

  sendKakao(userName, recommend) {
       return new Promise((resolve, reject)=>{
            KakaoTalk.share({
                    text : '싸게 샀다! 발그레\n' + userName + '님이 발그레로 초대합니다.\n추천인 코드 : ' + recommend,
                    image : {
                        src : 'http://sumcrimage.cafe24.com/beauty/event/20170323_210528860.png',
                        width : 200, 
                        height : 100,
                    },
                    applink :{
                     url :"", 
                    text : '앱 실행',
                    },
                    params :{
                        friendsCode : recommend
                    },
                    buttons: [ {
                        title: '웹으로 이동'
                    }]
                },
                function (success) {
                      resolve(success); 
                    console.log('kakao share success');
                },
                function (error) {
                    reject(error);
                    console.log('kakao share error');
                });
       });
  }

  shareKakao(title, imageUrl, params?) {
       return new Promise((resolve, reject)=>{
            KakaoTalk.share({
                    text : title,
                    image : {
                        src : imageUrl,
                        width : 200, 
                        height : 133,
                    },
                    applink :{
                     url :"", 
                    text : '이벤트 보러가기',
                    },
                    params : params
                },
                function (success) {
                      resolve(success); 
                    console.log('kakao share success');
                },
                function (error) {
                    reject(error);
                    console.log('kakao share error');
                });
       });
  }

  logout(){
    return new Promise((resolve,reject)=>{ 
            KakaoTalk.logout(()=>{
                resolve();
            },(err)=>{ // KakaoTalk.logout failure
                resolve();
            });
    });
  }

}


