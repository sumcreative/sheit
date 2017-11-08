import { Component, ViewChild, ElementRef , Renderer} from '@angular/core';
import { NavController, Slides, LoadingController, NavParams, Keyboard, Content, MenuController } from 'ionic-angular';
import { UserApi} from '../../providers/userApi';
import { CommonApi} from '../../providers/commonApi';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { PDetailPage } from '../profile-detail/p-detail';
import { SearchPage } from '../search/search';
import { MypagePage} from '../mypage/mypage';
import { DetailPage } from '../detail/detail';
import {MapPage} from '../map/map';
import { RulesPage } from '../rules/rules';
import { MapSearchPage } from '../map-search/map-search';

@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})

export class MainPage {
    @ViewChild(Content) content:Content;
    @ViewChild("header") header:ElementRef;
    @ViewChild("bannerSlide") bannerSlide:Slides;
    @ViewChild("videoSlide") videoSlide:Slides;
    @ViewChild("searchInput") searchInput;
    // @ViewChild("brandSlide") brandSlide:Slides;
    
    public main:string = "home";
    public ionScroll;
    public ionSegment;
    public loading;
    sort = 1;
    
    brands:any=[];
    categorys:any=[];
    bannerList:any = [];
    searchQuery: string = '';
    videos:any = [];
    products:any = [];
    constructor(public navCtrl: NavController,public params:NavParams, public element:ElementRef, 
                        private loadingCtrl:LoadingController, private menu:MenuController, 
                        public userApi:UserApi, public commonApi:CommonApi, 
                        public iab:InAppBrowser, public keyboard:Keyboard,public renderer:Renderer) {
          
    }
    scrollHandler(event) {
        event.domWrite(() => {
              if(event.scrollTop > 85) {
                    this.renderer.setElementStyle(this.header.nativeElement, 'display', 'block');
                } else {
                    this.renderer.setElementStyle(this.header.nativeElement, 'display', 'none');
                }
        });
      
    }

   ionViewDidLoad() {
       this.getData();
    }

    ionViewDidEnter() {

    }

    getData() {
        let loading = this.loadingCtrl.create({
            content: ""
        });
        loading.present();
        return new Promise((resolve, reject) => {
                this.commonApi.query("main").subscribe((data:any) => {
                    this.categorys = data.categorys;
                    this.brands = data.brands;
                    if(this.bannerList.length == 0) {
                        this.bannerList = data.banners;
                    }

                    if(this.videos.length == 0) {
                        this.videos = data.videos;
                    }
                    this.products = data.products;
                    // setTimeout(() => {
                    //    this.brandSlide.slideTo(0, 0);
                    // }, 100);
                    loading.dismiss();
                    resolve();
                },() => {
                    loading.dismiss();
                    reject()
                });
        });

    }

    bannerSlideChange() {
      console.log("CHANGE BANNER");
        if(this.bannerList.length == 1) {
        //     // this.firstSlider.autoplay=2000
            this.bannerSlide.loop = false;
            this.bannerSlide.stopAutoplay();
            this.bannerSlide.lockSwipes(true);
        } else {
              this.bannerSlide.loop = true;
             this.bannerSlide.startAutoplay();
              this.bannerSlide.lockSwipes(false);
        }
    }

    videoSlideChange() {
        // if(this.videos.length == 1) {
        // //     // this.firstSlider.autoplay=2000
        //     this.videoSlide.loop = false;
        //     this.videoSlide.stopAutoplay();
        //     this.videoSlide.lockSwipes(true);
        // } else {
        //       this.videoSlide.loop = true;
        //      this.videoSlide.startAutoplay();
        //     this.videoSlide.lockSwipes(false);
        // }
    }

    slideClick() {
        let theClickedIndex = this.bannerSlide.getActiveIndex();
        if(this.bannerList.length < theClickedIndex) {
            this.moveBanner(this.bannerList[0].banner);
        } else if(theClickedIndex == 0) {
            this.moveBanner(this.bannerList[this.bannerList.length-1].banner);
        } else {
            this.moveBanner(this.bannerList[theClickedIndex-1].banner);
        }
    } 
    moveBanner(banner) {
          if(banner.bnType == 1) {
                 this.iab.create(banner.moveInfo, "_system");
          } else {
            this.navCtrl.push(PDetailPage, {item:banner.moveInfo});
        }
    }
    videoClick() {
        let theClickedIndex = this.videoSlide.getActiveIndex();
        if(this.videos.length < theClickedIndex) {
            this.navCtrl.push(DetailPage, {content:this.videos[0].content, title:this.videos[0].prodName});
        } else if(theClickedIndex == 0) {
             this.navCtrl.push(DetailPage, {content:this.videos[this.videos.length-1].content, title:this.videos[this.videos.length-1].prodName});
        } else {
             this.navCtrl.push(DetailPage, {content:this.videos[theClickedIndex-1].content, title:this.videos[theClickedIndex-1].prodName});
        }
    } 

    openItem(item) {
        this.navCtrl.push(PDetailPage, {item:item.brandCode});
    }

    openEvent(item) {
        this.navCtrl.push(DetailPage, {content:item.content, title:item.prodName});
    }

    searchByKeyword() {
        if(this.searchQuery != "") {

            this.goSearch();
            this.keyboard.close();
        } else {
            this.searchInput.setFocus();
        }
    }

    goHashtag(tag) {
        this.navCtrl.push(SearchPage, {search:tag});
    }
    goSearch() {
        if(this.searchQuery == "") {
            this.searchInput.setFocus();
        } else {
            this.navCtrl.push(SearchPage, {search:this.searchQuery});
            this.searchQuery = "";
        }
    }
    
//     goLogin() {
//         if(!this.userApi.token) {
//             this.navCtrl.push(LoginPage);
//         } else {
//         // 마이페이지
//         this.navCtrl.push(MypagePage);
//         }
//   }

      doRefresh(refresher) {
        console.log('Begin async operation', refresher);
        
        setTimeout(() => {
            console.log('Async operation has ended');
            this.getData().then(() => {
                refresher.complete();
            }, () => { refresher.complete(); });
            
        }, 2000);
    }

    openSearch() {
        this.content.scrollToTop();
        this.searchInput.setFocus();
    }

    openMenu() {
        this.menu.open();
    }


    goMap(type) {
        if(type == 1) {
            let params:any = {};
            params.lat = this.commonApi.lat;
            params.lng = this.commonApi.lng;
            params.type = "my";
            params.accuracy = this.commonApi.accuracy;
            this.navCtrl.push(MapPage, params);
        } else if(type == 2) {
            this.navCtrl.push(MapSearchPage, {type:"subway"});
        } else if(type == 3) {
                this.navCtrl.push(MapSearchPage, {type:"place"});
        }
    }  

    rule(type) {
        let rules = "rules1";
        if(type == 0) {
            rules = "rules1";
        } else {
            rules = "rules2";
        }

        this.navCtrl.push(RulesPage, { type : rules});
    }

    goBanner(item) {
        console.log(item);
        if(item.bntype == 0) {   // 업체
             this.navCtrl.push(PDetailPage, {item:item.moveinfo});
        } else if(item.bntype == 1) { //이벤트 
            this.commonApi.query("product/detail/" + item.moveinfo).subscribe((data:any) => {
                 this.navCtrl.push(DetailPage, {content:data.content, title:data.prodName});
            });
        } else if(item.bntype == 2) { // URL
            this.iab.create(item.moveinfo, "_system");
        }
        
    }
}
