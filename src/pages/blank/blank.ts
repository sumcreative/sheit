import { Component } from '@angular/core';
import {  NavController, App, Platform, AlertController, LoadingController } from 'ionic-angular';
import { CommonApi} from '../../providers/commonApi';
import {AppVersion} from '@ionic-native/app-version';
import { Market } from '@ionic-native/market';
import {MainPage } from '../main/main';
import { Geolocation } from '@ionic-native/geolocation';
import {Storage} from '@ionic/storage';

@Component({
  selector: 'page-blank',
  templateUrl: 'blank.html',
})
export class BlankPage {
  sideCtg:any;
  pages = [];
  backPressed = false;
  constructor(public nav: NavController,  public app:App, public platform:Platform, 
                     public alertCtrl:AlertController,public commonApi:CommonApi, 
                     public appVersion:AppVersion, public market:Market, public loadingCtrl:LoadingController,
                     private geolocation:Geolocation) {
    }

    ngOnInit() {
       this.geolocation.getCurrentPosition().then((resp) => {
            this.commonApi.lat = resp.coords.latitude;
            this.commonApi.lng = resp.coords.longitude;
                                                this.commonApi.accuracy = resp.coords.accuracy;
       });
    }
    
    ionViewDidEnter() {
            this.initSideMenu();
    }

    initSideMenu() {
        let loading = this.loadingCtrl.create( {
            spinner: 'crescent',
            content: ''
        });
        loading.present();

        this.versionCheck().then((data)=> {
            setTimeout(() => {
                loading.dismiss();
                this.nav.setRoot(MainPage);
            }, 1000);
        },()=> {});
  }

 versionCheck() {
     return new Promise((resolve, reject) => {
        let os_type = "";
        if(this.platform.is("android")) {
            os_type = "A";
        } else if(this.platform.is("ios") || this.platform.is("iphone") || this.platform.is("ipad")) {
            os_type = 'I';
        }

        this.appVersion.getVersionNumber().then((s:string) =>  {
            this.commonApi.query("main/version/" + os_type+"?versionName="+s.replace("[.]", "")).subscribe((res:any) => {
                if(res.resultCode == 99) {
                    let alert = this.alertCtrl.create({
                        title: '버전 업데이트 ',
                        subTitle: res.message,
                        enableBackdropDismiss:false,
                        buttons: [{
                            text: '확인',
                            handler: () => {
                                this.market.open("com.sumcreative.sheit");
                                this.platform.exitApp();
                            }      
                         }]
                    });
                    alert.present();
                    reject();
                } else {
                    resolve();
                } 
            }, () => {resolve();})
        },() => {
            resolve();
        });
     });
    
       
    }

}
