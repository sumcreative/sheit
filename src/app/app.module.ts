import { ErrorHandler, NgModule } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { Camera } from '@ionic-native/camera';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonAffixModule } from 'ion-affix/dist';

import { IonicImageLoader } from 'ionic-image-loader';
import { Keyboard } from '@ionic-native/keyboard';
import { Crop  } from '@ionic-native/crop';
import { File } from '@ionic-native/file';
import { FileTransfer  } from '@ionic-native/file-transfer';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import {AppVersion} from '@ionic-native/app-version';
import { Market } from '@ionic-native/market';
import { CodePush} from '@ionic-native/code-push';
import { MyApp } from './app.component';
import { CallNumber } from '@ionic-native/call-number';
import { FCM } from '@ionic-native/fcm';
import { Geolocation } from '@ionic-native/geolocation';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SMS } from '@ionic-native/sms';
import {  ScrollTabsComponentModule} from '../component/scrolltabs';
import { Deeplinks } from '@ionic-native/deeplinks';

//Pages
import { BlankPage } from '../pages/blank/blank';
import { MainPage } from '../pages/main/main';                      // 메인
import { PDetailPage } from '../pages/profile-detail/p-detail';  // 업체 상세
import { SearchPage } from '../pages/search/search';               // 검색
import { MapPage } from '../pages/map/map';                           // 지도페이지
import { OptionsPage } from '../pages/options/options';           // 검색 옵션
import { NoticePage } from '../pages/notice/notice';                //공지사항
import { NoticeDetailPage } from '../pages/notice-detail/notice-detail';    //공지사항 상세
import { PhotoviewerPage} from '../pages/photoviewer/photoviewer';    // 이미지뷰어
import { MapSearchPage } from '../pages/map-search/map-search';       // 검색
import { DaumRoadviewPage} from '../pages/daum-roadview/daum-roadview';

import { ListPage} from '../pages/list/list';                 // 목록 페이지
import { DetailPage} from '../pages/detail/detail';     // 상세페이지

import { RulesPage } from '../pages/rules/rules';                  // 이용약관

import { MypagePage } from '../pages/mypage/mypage';                       // 마이페이지   
import { MypageWishPage } from '../pages/mypage-wish/mypage-wish';    // 관심목록
import { MypageUserPage } from '../pages/mypage-user/mypage-user';    //회원정보
import { MypageUserLeavePage } from '../pages/mypage-user-leave/mypage-user-leave'; //회원탈퇴

// API Provides
import { Api } from '../providers/api';
import { CategoryApi} from '../providers/categoryApi';
import { ProductApi} from '../providers/productApi';
import { SearchApi} from '../providers/searchApi';
import { ReviewApi } from '../providers/reviewApi';
import { UserApi} from '../providers/userApi';
import { HostApi } from '../providers/hostApi';
import { NoticeApi } from '../providers/noticeApi';
import { CommonApi } from '../providers/commonApi';
import {KakaoProvider} from '../providers/kakao-provider';

//Pipe
import { DateformatPipe} from '../pipes/dateformat/dateformat';
import { OrderByPipe } from '../pipes/order-by/order-by';

// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function HttpLoaderFactory(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    SearchPage,
    NoticePage,
    NoticeDetailPage,
    PDetailPage,
    MypagePage,
    MypageWishPage,
    MypageUserPage,
    MypageUserLeavePage,
    PhotoviewerPage,
    BlankPage,
    RulesPage,
    MainPage,
    MapPage,
    OptionsPage,
    DetailPage,
    ListPage,
    MapSearchPage,
    DaumRoadviewPage,
    DateformatPipe,
    OrderByPipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [Http]
      }
    }),
    IonicModule.forRoot(MyApp, {
            backButtonIcon:'ios-arrow-back',
            backButtonText: '',
            platforms: {
                ios: {
                    iconMode:'md',
                    menuType: 'overlay',
                    statusbarPadding: false,
                    scrollAssist: false,
                    autoFocusAssist: false,
                    pageTransition: 'md-transition'
                }
             }
    }),
    IonicImageLoader.forRoot(),
    IonicStorageModule.forRoot(),
    IonAffixModule,
    ScrollTabsComponentModule,
    BrowserAnimationsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SearchPage,
    NoticePage,
    NoticeDetailPage,
    PDetailPage,
    MypagePage,
    MypageWishPage,
    MypageUserPage,
    MypageUserLeavePage,
    PhotoviewerPage,
    BlankPage,
    RulesPage,
    MainPage,
    MapPage,
    OptionsPage,
    DetailPage,
    ListPage,
    MapSearchPage,
    DaumRoadviewPage
  ],
  providers: [
    Api,
    CategoryApi,
    ProductApi,
    ReviewApi,
    UserApi,
    NoticeApi,
    HostApi,
    CommonApi,
    SearchApi,
    KakaoProvider,
    Keyboard,
    Camera,
    Crop,
    File,
    FileTransfer,
    InAppBrowser,
    AppVersion,
    Market,
    FCM,
    CodePush,
    SplashScreen,
    StatusBar,
    CallNumber,
    SMS,
    Geolocation,
    Deeplinks,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
