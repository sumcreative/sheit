import { Component, ElementRef, ViewChild, Renderer } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController, Keyboard, MenuController, Content, ModalController, Platform  } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { CallNumber } from '@ionic-native/call-number';
import { SMS } from '@ionic-native/sms';
import { SearchPage } from '../search/search';
import { RulesPage } from '../rules/rules';
import { DaumRoadviewPage} from '../daum-roadview/daum-roadview';
import { PhotoviewerPage } from '../photoviewer/photoviewer';
import {Storage} from '@ionic/storage';
import { HostApi } from '../../providers/hostApi';
import { KakaoProvider } from '../../providers/kakao-provider';
import { UserApi } from '../../providers/userApi';
import { CommonApi } from '../../providers/commonApi';

declare var daum;

@Component({
  selector: 'page-p-detail',
  templateUrl: 'p-detail.html',
})
export class PDetailPage {
    @ViewChild(Content) content:Content;
    @ViewChild("nav") header;
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild("thumb") thumb;
  @ViewChild("segment") segment;
  @ViewChild("midSegment") midSegment;
   @ViewChild("reviewContainer") reviewContainer;
  @ViewChild("timeContainer") timeContainer;
  @ViewChild("priceContainer") priceContainer;
  @ViewChild("photoContainer") photoContainer;
  @ViewChild("naviContainer") naviContainer;
  type="time";
  headerHeight = 0;
  segmentHeight = 0;
  defaultPadding = 0;
  clickType:any = "none";

  item:any;
  map:any;
  hashtag:any = [];
  brand:any;
  brandPhoto:any = [];
  constructor(public nav: NavController, public params: NavParams, public iab:InAppBrowser, 
                      private toastCtrl :ToastController, public menu:MenuController,  public alertCtrl:AlertController, 
                      private callNumber: CallNumber, public keyboard:Keyboard, public kakaoProvider:KakaoProvider, 
                      public hostApi:HostApi, public userApi:UserApi,public commonApi:CommonApi ,
                      public sms:SMS,public renderer:Renderer, private modal:ModalController, public element:ElementRef,
                      public storage:Storage, public platform:Platform
                      ) {
        this.item = params.get("item");
        if(platform.is("ios")) {
            this.defaultPadding = 30;
        }

  }

  ngOnInit() {
      this.segmentHeight = this.segment.nativeElement.offsetHeight;
      this.headerHeight =this.header._elementRef.nativeElement.offsetHeight;
    this.renderer.setElementStyle(this.header._elementRef.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.segment.nativeElement, 'display', 'none');
    this.hostApi.query("brand/detail", {brand_code: this.item}).subscribe((data:any) => {
      this.brand = data.brand;
      this.brandPhoto = this.brand.brPhoto;
      if(this.brand.hashtag) {
        this.hashtag = this.brand.hashtag.split(" ");
        // console.log("tag", tag.length);
      }
      if(this.brand.coordinate) {
            setTimeout(()=>{
                this.loadMap();        
            }, 1000);
      }
    });

  }

    scrollEvent(event) {
        if(event) {
            event.domWrite(() => {
                let headerTop = this.header._elementRef.nativeElement.offsetTop + this.header._elementRef.nativeElement.offsetHeight;
                let maxTop = this.thumb.nativeElement.offsetHeight - headerTop;
                // console.log(this.header._elementRef);
                // console.log(this.segment);
                
                //  console.log(maxTop);
                //  console.log(event.scrollTop)
                if(event.scrollTop > 85) {
                    if(this.header._elementRef.nativeElement.style.display == 'none') {
                        this.renderer.setElementStyle(this.header._elementRef.nativeElement, 'display', '');
                    }
                } else {
                     if(this.header._elementRef.nativeElement.style.display == '') {
                        this.renderer.setElementStyle(this.header._elementRef.nativeElement, 'display', 'none');
                     }
                }
                if(event.scrollTop >= maxTop) {
                    if(this.segment.nativeElement.style.display == 'none') {
                        this.renderer.setElementStyle(this.segment.nativeElement, 'display', '');
                    }
                } else {
                    if(this.segment.nativeElement.style.display == '') {
                        this.renderer.setElementStyle(this.segment.nativeElement, 'display', 'none');
                    }
                }

                let scrollBottom = this.content.getContentDimensions().scrollTop +this.content.scrollHeight;
                let scrollHeight = this.content.getContentDimensions().scrollHeight;
                let paddingTop =  (this.headerHeight + this.segmentHeight + this.defaultPadding);
                let timeTop = this.timeContainer.nativeElement.offsetTop - paddingTop;
                let priceTop = this.priceContainer.nativeElement.offsetTop-paddingTop;
                let photoTop = this.photoContainer.nativeElement.offsetTop-paddingTop;
                let naviTop = this.naviContainer.nativeElement.offsetTop-paddingTop;
                let timeH = timeTop + this.timeContainer.nativeElement.offsetHeight;
                 let priceH = priceTop + this.priceContainer.nativeElement.offsetHeight;
                  let photoH = photoTop + this.photoContainer.nativeElement.offsetHeight;
                  if(scrollBottom >= scrollHeight) {
                        // if(this.clickType == 'none' || this.clickType == 'navi') {
                                this.segmentActiveChange("navi");
                            // }`
                    } else  if(event.scrollTop < timeH -5) {
                            if(this.clickType == 'none' || this.clickType == 'time') {
                                this.segmentActiveChange("time");
                            }
                            
                    } else if(event.scrollTop >= priceTop-5 && event.scrollTop < priceH) {
                            if(this.clickType == 'none' || this.clickType == 'price') {
                                this.segmentActiveChange("price");
                            }
                    }  else if(event.scrollTop >= photoTop-5 && event.scrollTop < photoH) {
                            if(this.clickType == 'none' || this.clickType == 'photo') {
                                this.segmentActiveChange("photo");
                            }
                    } else {
                            if(this.clickType == 'none' || this.clickType == 'navi') {
                                this.segmentActiveChange("navi");
                            }
                    }
                   
            });
            
        }
    }

    scrollEnd(event) {
        // let paddingTop =  (this.headerHeight + this.segmentHeight + this.defaultPadding);
        // let timeTop = this.timeContainer.nativeElement.offsetTop - paddingTop;
        // let priceTop = this.priceContainer.nativeElement.offsetTop-paddingTop;
        // let photoTop = this.photoContainer.nativeElement.offsetTop-paddingTop;
        // let naviTop = this.naviContainer.nativeElement.offsetTop-paddingTop;
        // let timeH = timeTop + this.timeContainer.nativeElement.offsetHeight;
        // let priceH = priceTop + this.priceContainer.nativeElement.offsetHeight;
        // let photoH = photoTop + this.photoContainer.nativeElement.offsetHeight;
        // let naviH = naviTop + this.naviContainer.nativeElement.offsetHeight;
        // if(event.scrollTop < timeH) {
        //     this.type = "time";
        // } else if(event.scrollTop >= priceTop && event.scrollTop < priceH) {
            
        //     this.type = "price";
        // }  else if(event.scrollTop >= photoTop && event.scrollTop < photoH) {
        //     this.type = "photo";
        // } else if(event.scrollTop > naviTop) {
        //     this.type = "navi";
        // }
    }
    segmentActiveChange(type) {
        let children = this.segment.nativeElement.children;
        let children2 = this.midSegment.nativeElement.children;
        let i:any = 0;
        for(i in children) {
            if(type == "time") {
       
                if(i == 0) {
                     try{ this.renderer.setElementClass(children[i], "segment-activated", true);} catch(e){};
                     try{ this.renderer.setElementClass(children2[i], "segment-activated", true);} catch(e){};
                } else {
                     try{ this.renderer.setElementClass(children[i], "segment-activated", false);} catch(e){};       
                     try{ this.renderer.setElementClass(children2[i], "segment-activated", false);} catch(e){};     
                }
            } else if(type == "price") {
                if(i == 1) {
                     try{ this.renderer.setElementClass(children[i], "segment-activated", true);} catch(e){};
                      try{ this.renderer.setElementClass(children2[i], "segment-activated", true);} catch(e){};
                } else {
                     try{ this.renderer.setElementClass(children[i], "segment-activated", false);} catch(e){};
                      try{ this.renderer.setElementClass(children2[i], "segment-activated", false);} catch(e){};   
                }
            } else if(type == "photo") {
                if(i == 2) {
                     try{ this.renderer.setElementClass(children[i], "segment-activated", true);} catch(e){};
                      try{ this.renderer.setElementClass(children2[i], "segment-activated", true);} catch(e){};
                } else {
                     try{ this.renderer.setElementClass(children[i], "segment-activated", false);} catch(e){};
                      try{ this.renderer.setElementClass(children2[i], "segment-activated", false);} catch(e){};   
                }
            } else if(type == "navi") {
                if(i == 3) {
                     try{ this.renderer.setElementClass(children[i], "segment-activated", true);} catch(e){};
                      try{ this.renderer.setElementClass(children2[i], "segment-activated", true);} catch(e){};
                } else {
                     try{ this.renderer.setElementClass(children[i], "segment-activated", false);} catch(e){};
                      try{ this.renderer.setElementClass(children2[i], "segment-activated", false);} catch(e){};   
                }
            }
            // this.renderer.setElementClass(el, "segment-activated", false);
            
        }
        this.clickType = "none";
    }
    changeSegment(type) {
        this.clickType = type;
        let paddingTop =  (this.headerHeight + this.segmentHeight + this.defaultPadding);
        let contentTop = this.content.scrollTop;
        if(type == "review") {
            let top = this.reviewContainer.nativeElement.offsetTop - paddingTop;
            // let h = top + this.reviewContainer.nativeElement.offsetHeight;
            //  if(contentTop <= top || contentTop > h-5) {
                this.content.scrollTo(0, top, 300);
            //  }
        } else if(type == "time") {
             let top = this.timeContainer.nativeElement.offsetTop - paddingTop;
            //   let h = top + this.timeContainer.nativeElement.offsetHeight;
            //   console.log(contentTop, h);
        //    if(contentTop > h-5) {
                this.content.scrollTo(0, top, 300);
            //  }
        }  else if(type == "price") {
            let top = this.priceContainer.nativeElement.offsetTop - paddingTop;
            // let h = top + this.priceContainer.nativeElement.offsetHeight;
        //    if(contentTop <= top -5 || contentTop > h) {
                this.content.scrollTo(0, top, 300);
            //  }
        }    else if(type == "photo") {
            let top =  this.photoContainer.nativeElement.offsetTop - paddingTop;
            //  let h = top + this.photoContainer.nativeElement.offsetHeight;
            //  if(contentTop <= top -5 || contentTop > h) {
                this.content.scrollTo(0, top, 300);
            //  }
        } else if(type == "navi") {
            let top = this.naviContainer.nativeElement.offsetTop - paddingTop;
            this.content.scrollToBottom(300);
            // if(contentTop <= top-5) {
                // this.content.scrollTo(0, top, 300);
            // }
            
        }
  }
  ngAfterViewInit() {
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
    
    ionViewDidLoad() {
    }


     loadMap() {
    //  let latLng:string = this.brand.coordinate;
      let coord = this.brand.coordinate.split(",");
      
     var options = {
        center : new daum.maps.LatLng(coord[0], coord[1]),
        draggable: false,
        level: 3
     };
      this.map = new daum.maps.Map(this.mapElement.nativeElement, options);
      this.map.setDraggable(false);
      this.map.setZoomable(false);
        let imageSrc = "assets/img/marker.png";
        let imageSize = new daum.maps.Size(50,50);
        let imageOprion = {offset: new daum.maps.Point(25,29)};
        var markerImage = new daum.maps.MarkerImage(imageSrc, imageSize, imageOprion);
        var marker  = new daum.maps.Marker({
            //   map:this.maps,
            position:new daum.maps.LatLng(coord[0], coord[1]),
            zIndex: 9999,
            image:markerImage
        });
        marker.setMap(this.map);
  }

  goHomepage() {
    // 홈페이지 이동
    this.iab.create(this.brand.homepage, "_system");
  }

  openMenu() {
      this.menu.open();
  }
  
  goHashtag(tag) {
        let txt = tag.replace("#", "");
        this.nav.push(SearchPage, {search:txt});
    }

    addWishlist() {
        if(this.userApi.token) {
            this.commonApi.add("wish/add_brand", "brand_code=" + this.brand.brandCode).subscribe((res:any) => {
                this.showToastWithCloseButton('찜목록에 등록되었습니다.');
            }
            ,()=> {
                this.showToastWithCloseButton('등록에 실패하였습니다.');
            });
        } else {
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
                        this.goLogin().then(()=> {
                            this.commonApi.add("wish/add_brand", "brand_code=" + this.brand.brandCode).subscribe((res:any) => {
                                this.showToastWithCloseButton('찜목록에 등록되었습니다.');
                            }
                            ,()=> {
                                this.showToastWithCloseButton('등록에 실패하였습니다.');
                            });
                        });
                    }
                  }
                ]
            });
            confirm.present();
            // this.showToastWithCloseButton("준비 중입니다.");
            // this.nav.push(LoginPage);
        }
    }

    shareBrand() {
      this.commonApi.query("kakaoShare", {brand_code: this.brand.brandCode}).subscribe((res:any) => {
        console.log(res);
          this.kakaoProvider.shareKakao(res.content,res.image, {productId:this.brand.brandCode}).then((res:any)=> {
              // this.showToastWithCloseButton('전송 되었습니다.');
          }, ()=> {
              this.showToastWithCloseButton('공유하기에 실패하였습니다.');
          });
      });
        
    }

    rule(type) {
        let rules = "rules1";
        if(type == 0) {
            rules = "rules1";
        } else {
            rules = "rules2";
        }

        this.nav.push(RulesPage, { type : rules});
    }
    call() {
        if(this.brand.phone) {
          this.callNumber.callNumber(this.brand.phone, false)
            .then(() => console.log('Launched dialer!'))
            .catch(() => console.log('Error launching dialer'));
      }
    }
    sendSms() {
        console.log(this.brand.phone);
        if(this.brand.phone) {
            var options = {
                replaceLineBreaks: false,
                android: {
                    intent: 'INTENT'
                }
            };
          this.sms.send(this.brand.phone, "", options)
            .then(() => console.log('Launched dialer!'))
            .catch(() => console.log('Error launching dialer'));
      }
    }

    goRoadview() {
        this.iab.create("http://map.daum.net/link/roadview/" + this.brand.coordinate, "_system");
        // let coord = this.brand.coordinate.split(",");
        // this.nav.push(DaumRoadviewPage, {lat:coord[0], lng:coord[1]});
    }

    openPhoto(index) {
        let detailModal = this.modal.create(PhotoviewerPage, {photos:this.brandPhoto, index:index});
          detailModal.present();
    }

    goKakao() {
        this.iab.create(this.brand.kakao_url, "_system");
    }

    goBack() {
        this.nav.pop();
    }

    goLogin() {
        return new Promise((resolve,reject)=>{
            this.kakaoProvider.login().then((res:any) => {
                this.serverLogin(res).then(() => {
                    resolve();
                },() => {reject();});
            }, () => { reject();});
        });
    }

    serverLogin(userprofile) {
        return new Promise((resolve,reject)=>{
            let userProfile:any = {};
            console.log(userprofile);
            userProfile.kakaoid = userprofile.id;
            userProfile.email = userprofile.email;
            userProfile.nickname = userprofile.nickname;

            this.userApi.login("auth/login", userProfile).subscribe((res:any) => {
                this.storage.set("isLogin", true);
                this.storage.set("userProfile", userProfile);
                this.userApi.token = res.token;
                this.userApi.user = userProfile;
                resolve();
            },
            (err:any) => { reject(); });
        });
    }
}
