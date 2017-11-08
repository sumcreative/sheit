import { Component,  ElementRef } from '@angular/core';
import {  NavController, NavParams,  ToastController, AlertController } from 'ionic-angular';
import {Storage} from '@ionic/storage';
import { UserApi } from '../../providers/userApi';

@Component({
  selector: 'page-mypage-user-leave',
  templateUrl: 'mypage-user-leave.html',
})
export class MypageUserLeavePage {
  public agree = false;
    public reason = "";
    public mask;
    public alert;
  constructor(public navCtrl: NavController, public params:NavParams, public userApi:UserApi,
                        private alertCtrl:AlertController, private toastCtrl :ToastController,private element: ElementRef, 
                        public storage:Storage,) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MypageUserLeavePage');
  }
    leaveSubmit() {
        if(this.agree) {
            this.mask = document.querySelector("#mark");
            this.alert  = document.querySelector("#find_add");
            this.mask.style.display = "block";
            this.alert.style.display = "block";
        } else {
             let alert = this.alertCtrl.create({
                title: '',
                subTitle: '회원탈퇴 안내 확인 사항에 동의해주세요.',
                buttons: ['확인']
            });
            alert.present();
        }
        
    }

    alertClose() {
        this.mask = document.querySelector("#mark");
        this.alert  = document.querySelector("#find_add");
        this.mask.style.display = "none";
        this.alert.style.display = "none";
    }
    alertAction(pos) {
        if(pos == 0) {
            this.mask = document.querySelector("#mark");
            this.alert  = document.querySelector("#find_add");
            this.mask.style.display = "none";
            this.alert.style.display = "none";
        } else {
            this.userApi.update("mypage/memberLeave", {reason:this.reason}).subscribe((data:any) => {
                 let alert = this.alertCtrl.create({
                        title: '',
                        subTitle: '탈퇴되었습니다.',
                        buttons: [
                            {
                                text:'확인',
                                handler: () => {
                                    this.storage.set("username", "");
                                    this.storage.set("password", "");
                                    window.location.reload();
                                }
                            }]
                    });
                    alert.present();
            });
           
        }
    }
}
