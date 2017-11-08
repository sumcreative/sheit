import { Component } from '@angular/core';
import { ViewController, ToastController, AlertController } from 'ionic-angular';
import {Storage} from '@ionic/storage';
import { KakaoProvider } from '../../providers/kakao-provider';
import { UserApi } from '../../providers/userApi';

@Component({
  selector: 'page-mypage-user',
  templateUrl: 'mypage-user.html',
})
export class MypageUserPage {
    public nickname="";
    public phone = "";
    public email = "";
    public password;
    public rePassword;

  constructor(public viewCtrl: ViewController, public toastCtrl: ToastController, public userApi:UserApi,  private kakaoProvider:KakaoProvider,  
                     public alertCtrl:AlertController, public storage:Storage) {
             this.initUserData();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MypageUserPage');
  }

    initUserData() {
            this.email = this.userApi.user.email;
            this.nickname = this.userApi.user.member.nickname;
            this.phone = this.userApi.user.phone;
    }

    updateSubmit() {
        if(this.nickname == "") {
            this.showToastWithCloseButton("닉네임을 입력 해 주세요.");
            return;
        }
        if(this.password) {
            if(this.password.length < 5) {
                this.showToastWithCloseButton("비밀번호는 5자리 이상 입력 해 주세요.");
                return;
            } 
            if(!this.rePassword) {
                this.showToastWithCloseButton("비밀번호를 확인 해 주세요");
                return;
            }  
            if(this.password != this.rePassword) {
                this.showToastWithCloseButton("비밀번호를 확인 해 주세요");
                return;
            } 
        } 

        this.userApi.update("mypage/update", {password:this.password, nickname:this.nickname, phone:this.phone}).subscribe((data:any) => {
                 let alert = this.alertCtrl.create({
                        title: '',
                        subTitle: ' 수정되었습니다.',
                        buttons: [
                            {
                                text:'확인',
                                handler: () => {
                                    this.userApi.user.member.nickname = this.nickname;
                                    this.storage.set("password", this.password);
                                }
                            }]
                    });
                    alert.present();
            });
        // this.beautyService.userUpdate(this.password, this.skin, smsAgr, emailAgr).then((res:any) => {
        //     console.log(res);
        //     if(res.resultCode == 200) {
        //         this.showToastWithCloseButton("수정 되었습니다.");
        //         this.navCtrl.pop();
        //     } else {
        //         this.showToastWithCloseButton(res.message);
        //     }
        // },(err)=> {
        // console.log(err);
        // });
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


    kakaoLogin() {
       this.kakaoProvider.login().then((res:any)=>{
            console.log("kakaoProvider-login page:"+JSON.stringify(res));
            console.log(res.id);
            if(res.id){
                // this.beautyService.snsConnect(res.id, "K").then((res:any) => {
                //      this.showToastWithCloseButton("연결 되었습니다.");
                //      this.loadData();
                // }, () => {});
            } else {
                console.log("invalid result comes from server-"+JSON.stringify(res));
                this.showToastWithCloseButton("카카오 로그인 에러가 발생했습니다");
            }
        },login_err =>{
            console.log(JSON.stringify(login_err));
            console.log("login_err"+JSON.stringify(login_err));
            this.showToastWithCloseButton("카카오 로그인 에러가 발생했습니다\n확인 후 다시 시도해주세요.");
        }); 
    }

    kakaoLogout() {
        this.kakaoProvider.logout().then((res:any) => {
            //  this.beautyService.snsDisConnect("K").then((res:any) => {
            //          this.showToastWithCloseButton("해제 되었습니다.");
            //          this.loadData();
            //     }, () => {});
        });
    }
}
