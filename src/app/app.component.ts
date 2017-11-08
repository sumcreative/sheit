import { Component, ViewChild } from '@angular/core';
import { Nav, Keyboard, Platform, IonicApp, MenuController, Slides, AlertController, App, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {Storage} from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { FCM } from '@ionic-native/fcm';
import { CodePush, InstallMode } from '@ionic-native/code-push';
import { Deeplinks }  from '@ionic-native/deeplinks';

import { BlankPage } from '../pages/blank/blank';
import { NoticePage } from '../pages/notice/notice';
import { MypagePage } from '../pages/mypage/mypage';
import { MypageWishPage } from '../pages/mypage-wish/mypage-wish';
import {SearchPage} from '../pages/search/search';
import {PDetailPage} from '../pages/profile-detail/p-detail';
import { ListPage} from '../pages/list/list';
import {KakaoProvider} from '../providers/kakao-provider';

import { CategoryApi} from '../providers/categoryApi';
import { UserApi} from '../providers/userApi';
import { ProductApi} from '../providers/productApi';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  @ViewChild("menuSlide") menuSlide:Slides;

  rootPage: any = BlankPage;
  backPressed = false;
  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, 
                      public categoryApi:CategoryApi, public menuCtrl:MenuController, public userApi:UserApi, 
                      public productApi:ProductApi,  public storage:Storage, public  toastCtrl:ToastController,
                      private alertCtrl:AlertController, public app:App, public keyboard:Keyboard, public ionicApp:IonicApp,
                      public iab:InAppBrowser, private fcm:FCM, private deeplinks:Deeplinks,
                      public codePush:CodePush, public kakaoProvider:KakaoProvider
                      ) {
            this.initializeApp();
  }

  initFcm() {
      this.fcm.subscribeToTopic('sheit');
      this.fcm.getToken().then(token => {
         console.log("the token is ${token}");
       });
       this.fcm.onNotification().subscribe((data:any) => {
          if(data.wasTapped) {
                let seq = data.seq;    // L 카테고리 ID   D: 이동 ID 
                let type = data.type;   //  E: 이벤트  B:브랜드 
                let move = data.move; // L :리스트  D : 상세  H: 홈
                if(move == 'H') {
                    this.nav.push(BlankPage);
                } else if(move == 'L') {
                    this.categoryApi.query("category/detail/"+seq).subscribe((data:any) => {
                      this.openPage(data);
                    });
                } else if(move == 'D') {
                  if(type == 'E') {
                    //   this.productApi.query("product/detail/" + seq).subscribe((data:any) => {
                    //     this.app.getRootNav().push(DetailPage, {item:data});
                    //   });
                  } else if(type == 'B') {
                    //   this.app.getRootNav().push(ProfileDetailPage, {item:seq});
                  }
                }
          
                    console.log("Received in background");
          } else {
                console.log("Received in foreground");
          }
       });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
        if(this.platform.is("cordova")) {
            this.codePush.sync({installMode: InstallMode.ON_NEXT_RESTART}).subscribe((syncStatus) => {
                console.log("Sync", syncStatus);
        })
        };
      this.initDeeplinks();
       this.platform.registerBackButtonAction(() =>{
            if(this.keyboard.isOpen()) {
                return this.keyboard.close();
          }
        let activePortal = this.ionicApp._loadingPortal.getActive() || this.ionicApp._modalPortal.getActive() || this.ionicApp._toastPortal.getActive() ||this.ionicApp._overlayPortal.getActive();

        if(activePortal && !this.backPressed) {
          return activePortal.dismiss();
        }

        if(this.menuCtrl.isOpen()) {
          return this.menuCtrl.close();
        }

        if(this.nav.canGoBack()) {
          return this.nav.pop();
        }
            if(!this.backPressed) {
                this.backPressed = true;
                this.showToastWithCloseButton("'뒤로'버튼을 한번 더 누르시면 종료됩니다.");
                setTimeout(() => this.backPressed = false, 2000);
                return;
            } else {
                // this.storage.set("popup", false);
                this.platform.exitApp();
            }
        });
      this.initFcm();
            this.statusBar.backgroundColorByHexString("#3b4254");
            if(this.platform.is("ios")) {
                this.statusBar.overlaysWebView(false);
                this.statusBar.styleBlackOpaque();
            } else {
                this.statusBar.styleDefault();
            }
            
      

    });

    this.platform.resume.subscribe(() => {
        if(this.platform.is("cordova")) {
            this.codePush.sync({installMode: InstallMode.ON_NEXT_RESTART}).subscribe((syncStatus) => {
                console.log("Sync", syncStatus);
            });
        }
    });
  }
 
    initDeeplinks() {
        this.deeplinks.routeWithNavController(this.nav, {
                '/brand/:item': PDetailPage,
                '/search/:category/:search': SearchPage,
        }).subscribe((match) => {
            console.log("Unmatched Route", match);
        }, (nomatch) =>{
            console.log("Unmatched Route", nomatch);
        });
    }
  openPage(category) {
    if(!category) { return; }
    if(category.listTemplate == 3 || category.listTemplate == 4) {
        if(!this.userApi.token) {
            let confirm = this.alertCtrl.create( {
                title: '로그인 하시겠습니까?',
                message: '',
                buttons: [
                  {
                    text:'취소',
                     role: 'cancel'
                  },
                  {
                    text:'로그인',
                    handler: () => {
                      this.goLogin();
                    }
                  }
                ]
            });
            confirm.present();
            return;
        } 
    } 
    
    this.stopMenuSlide();
    this.menuCtrl.close();
    if(category.viewTemplate == 0) {
        // 메인
        this.nav.popToRoot();
    } else if(category.viewTemplate == 9) {
        this.nav.push(MypageWishPage);
    } else {
        // this.nav.popTo(ListPage, {title: category.menuName, menuId:category.menuId, viewTemplate:category.viewTemplate});
        // this.nav.pop({animate:false}).then(()=> {
            // this.app.getRootNav().push(ListPage, {title: category.menuName, menuId:category.menuId, viewTemplate:category.viewTemplate});
            if(this.nav.length() == 1) {
                this.nav.push(ListPage, {title: category.menuName, menuId:category.menuId, viewTemplate:category.viewTemplate});
            } else {
  
                this.nav.push(ListPage, {title: category.menuName, menuId:category.menuId, viewTemplate:category.viewTemplate});
                this.nav.remove(1, this.nav.length()-1, {animate: false});
                // for(let view of this.nav.getViews()) {

                // }
            }
            
        // });
    }
  }

  menuOpen() {
      if(this.categoryApi.sideBanner.length > 0) {

        this.menuSlide.update();

        this.menuSlide.slideTo(0);
         this.menuSlide.startAutoplay();
      }
    }

    goLogin() {
        this.stopMenuSlide();
       this.menuCtrl.close();
       this.kakaoProvider.login().then((res:any) => {
           this.serverLogin(res);
       });
    //    this.showToastWithCloseButton("준비 중입니다.");
    //   this.nav.push(LoginPage);
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
                        this.storage.set("isLogin", false);
                        this.storage.set("userProfile", {});
                        this.userApi.token = "";
                        this.userApi.user = {};
                        // window.location.reload();
                    }
                  }
                ]
            });
            confirm.present();
    }

    myPage() {
       this.stopMenuSlide();
       this.menuCtrl.close();
      this.nav.push(MypagePage);
    }

    goNotice() {
       this.stopMenuSlide();
      this.menuCtrl.close();
      this.nav.push(NoticePage);
    }

      menuSlideChange() {
          console.log("CHANGE MENU ");
        if(this.categoryApi.sideBanner.length == 1) {
        //     // this.firstSlider.autoplay=2000
            this.menuSlide.loop = false;
            this.stopMenuSlide();
            this.menuSlide.lockSwipes(true);
        } else {
              this.menuSlide.loop = true;
              this.menuSlide.autoplay=2000;
             this.menuSlide.startAutoplay();
        }
    }

    slideClick() {
        let theClickedIndex = this.menuSlide.getActiveIndex();
        if(this.categoryApi.sideBanner.length < theClickedIndex) {
            this.moveSb(this.categoryApi.sideBanner[0]);
        } else if(theClickedIndex == 0) {
            this.moveSb(this.categoryApi.sideBanner[this.categoryApi.sideBanner.length-1]);
        } else {
            this.moveSb(this.categoryApi.sideBanner[theClickedIndex-1]);
        }
    } 

    moveSb(banner) {
       if(banner.bnType == 1) {
          this.iab.create(banner.moveInfo, "_system");
      } else {
        this.productApi.query("product/detail/" + banner.moveInfo).subscribe((data:any) => {
            this.stopMenuSlide();
              this.menuCtrl.close();
            //    this.nav.push(DetailPage,  {item:data});
        });
      }
    }
    showToastWithCloseButton(msg) {
        const toast = this.toastCtrl.create({
            message: msg,
            duration: 2000,
            showCloseButton: false,
            position: 'bottom'
        });
        toast.present();
    }

    initializeSetting() {
        this.storage.ready().then(() => {       
            this.storage.get("isLogin").then((val) => {
                if(val) {
                    this.goLogin();
              }
          }) ;
        });
    }
    serverLogin(userprofile) {
        let userProfile:any = {};
       
        userProfile.kakaoid = userprofile.id;
        userProfile.email = userprofile.email;
        userProfile.nickname = userprofile.nickname;
         console.log(userprofile);
        this.userApi.login("auth/login", userProfile).subscribe((res:any) => {
            console.log("LOGIN RES", res);
            this.storage.set("isLogin", true);
            this.storage.set("userProfile", userProfile);
            this.userApi.token = res.token;
            this.userApi.user = userProfile;
            this.showToastWithCloseButton(userProfile.nickname + "님이 로그인 하였습니다.");
            // this.userApi.query("v1/mypage/user_info").subscribe((data:any) => {
            //     this.userApi.user = data;
            // });
           
            // this.navController.pop().then(() => this.navParams.get('resolve')('login'));
        },
        (err:any) => { console.log("LOGIN ERROR", err); });
    }

    stopMenuSlide() {
        if(this.menuSlide) {
            this.menuSlide.stopAutoplay();
        }
    }

    goHome(type) {
        this.stopMenuSlide();
        this.menuCtrl.close();
        if(type == 0) {
            this.nav.popToRoot();
        } else if(type == 1) {
            // 찜
            if(!this.userApi.token) {
                // this.showToastWithCloseButton("준비 중입니다.");
                let confirm = this.alertCtrl.create( {
                    title: '로그인 하시겠습니까?',
                    message: '',
                    buttons: [
                    {
                        text:'취소',
                        role: 'cancel'
                    },
                    {
                        text:'로그인',
                        handler: () => {
                        this.goLogin();
                        }
                    }
                    ]
                });
                confirm.present();
                return;
            } 
            this.nav.push(MypageWishPage);
        }else if(type == 2) {
            // 이벤트
            this.nav.push(ListPage, {menuId:"3", viewTemplate:"3"});
            this.nav.remove(1, this.nav.length()-1, {animate: false});
        }else if(type == 3) {
            //1:1
        }else if(type == 4) {
            //알람
        }
        
    }
}
