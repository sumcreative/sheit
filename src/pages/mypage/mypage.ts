import { Component } from '@angular/core';
import { NavController, AlertController, ToastController } from 'ionic-angular';
import {Storage} from '@ionic/storage';
import { UserApi } from '../../providers/userApi';
import { KakaoProvider } from '../../providers/kakao-provider';
import {RulesPage } from '../rules/rules';
import { MypageWishPage } from '../mypage-wish/mypage-wish';
import { MypageUserPage } from '../mypage-user/mypage-user';
import { MypageUserLeavePage } from '../mypage-user-leave/mypage-user-leave';
import { FCM } from '@ionic-native/fcm';

@Component({
  selector: 'page-mypage',
  templateUrl: 'mypage.html',
})
export class MypagePage {
    public alarmState = true;
    public smsAgree = true;
    public emailAgree = true;
  constructor(public nav: NavController, public userApi:UserApi, private storage:Storage, 
  public fcm:FCM,  private alertCtrl:AlertController, public toastCtrl:ToastController, public kakaoProvider:KakaoProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MypagePage');
    this.userApi.query("v1/mypage/user_info").subscribe((data:any) => {
        console.log(data);
        this.userApi.user = data;
        if( this.userApi.user.pushAgree == 'Y') {
             this.alarmState = true;
         } else {
             this.alarmState = false;
         }
         if( this.userApi.user.smsAgree == 'Y') {
             this.smsAgree = true;
         } else {
             this.smsAgree = false;
         }
         if( this.userApi.user.emailAgree == 'Y') {
             this.emailAgree = true;
         } else {
             this.emailAgree = false;
         }
    });
  }

  goMenu(idx) {
        switch (idx) {
            case 1: // 찜
                this.nav.push(MypageWishPage);
                break;
            case 2: //게시물
                break;
            case 3: //쪽지
                break;
            case 4: //초대
                this.shareShetalk();
                break;
            case 5:  // 내정보
                 this.nav.push(MypageUserPage);
                break;
            case 6: //틸퇴
                this.nav.push(MypageUserLeavePage);
                break;
            case 7: //이용약관
                this.nav.push(RulesPage, {type:'rules1'});
                break;
            case 8: //개인정보처리
                this.nav.push(RulesPage, {type:'rules2'});
                break;
            default:
                break;
        }

    }

    shareShetalk() {
        let shareTitle = "쉬잇 초대장\n\n이용자와 함께 만드는 정직한 성형어플 쉬잇 \n강남주요 업체 정보부터 시술후기까지 한번에~ \n이제 더 이상 발품 팔지말고 쉬잇으로 편리하게 상담해 보세요 :)";
        this.kakaoProvider.shareKakao(shareTitle, "http://sumcrimage.cafe24.com/shetalk/kakaotalk.jpg").then((res:any)=> {
            // this.showToastWithCloseButton('전송 되었습니다.');
        }, ()=> {
            this.showToastWithCloseButton('친구 초대하기에 실패하였습니다.');
        });
    }

    alarmChange(type) {
        console.log(type);
        let agree = "";
        if(type == 'P') {
            if(this.alarmState) {
                agree = "Y";
            } else {
                agree = "N";
            }
        } else if(type == 'E') {
            if(this.emailAgree) {
                agree = "Y";
            } else {
                agree = "N";
            }
        } else if(type == 'S') {
            if(this.smsAgree) {
                agree = "Y";
            } else {
                agree = "N";
            }
        }
        this.setAlarmAgree(type, agree);
     
    }

    setAlarmAgree(type, agree) {
        let param:any = "type="+type + "&agree=" + agree;
        console.log(param);
        this.userApi.update("mypage/agree", {type:type, agree:agree}).subscribe((data:any) => {
                if(data.resultCode == 200) {
                    if(type == 'P') {
                        if(agree == 'Y') {
                            this.alarmState = true;
                        } else {
                            this.alarmState = false;
                        }
                        this.userApi.user.pushAgree = agree;
                        this.storage.set("isNotification", this.alarmState);
                        if(this.alarmState) {
                            // this.firebase.subscribe('shetalk');
                            this.fcm.subscribeToTopic('shetalk');
                        } else {
                            // this.firebase.unsubscribe('shetalk');
                            this.fcm.unsubscribeFromTopic('shetalk');
                        }
                    } else if(type == 'E') {
                        if(agree == 'Y') {
                            this.emailAgree = true;
                        } else {
                            this.emailAgree = false;
                        }
                        this.userApi.user.emailAgree = agree;
                    } else if(type == 'S') {
                        if(agree == 'Y') {
                            this.smsAgree = true;
                        } else {
                            this.smsAgree = false;
                        }
                        this.userApi.user.smsAgree = agree;
                    }
                }
        });
    }
     logout() {
      let confirm = this.alertCtrl.create( {
                title: '로그아웃 하시겠습니까?',
                message: '',
                buttons: [
                  {
                    text:'취소',
                     role: 'cancel'
                  },
                  {
                    text:'로그아웃',
                    handler: () => {
                        this.userApi.token = "";
                        this.userApi.user = {};
                        this.storage.set("username", "");
                        this.storage.set("password", "");
                        window.location.reload();
                    }
                  }
                ]
            });
            confirm.present();
    }

    showToastWithCloseButton(msg) {
        const toast = this.toastCtrl.create({
            message: msg,
            duration: 2000,
            showCloseButton: false,
            position: 'top'
        });
        toast.present();
    }
}
