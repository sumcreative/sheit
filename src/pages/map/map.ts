import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { CommonApi} from '../../providers/commonApi';
import { PDetailPage } from '../profile-detail/p-detail';
import { ListPage} from '../list/list';
import { MapSearchPage} from '../map-search/map-search';
import { IScrollTab, ScrollTabsComponent } from '../../component/scrolltabs';

import { trigger, style, animate, transition } from '@angular/core';

declare var daum;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
  animations: [
      trigger('fadeInOut', [
          transition(':enter', [
          style({transform: 'translateY(100%)', opacity: 0}),
          animate('300ms', style({transform: 'translateY(0)', opacity: 1}))
        ]),
        transition(':leave', [
          style({transform: 'translateY(0)', opacity: 1}),
          animate('300ms', style({transform: 'translateY(100%)', opacity: 0}))
        ])
    ])
  ]
  
})
export class MapPage {
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('scrollTab') scrollTab: ScrollTabsComponent;
  lat:any = 37.566826;
  lng:any = 126.9786567;
  accuracy:any;
  type:any =9;
  trackDisabled = true;
  
  item:any;                     // 업체 목록
  data:any;
  maps:any;                 // 다음맵
  circle:any;               // 클릭 원
  markers:any = [];           // 상품 마커
  sbMarkers:any = [];       // 지하철역 마커
  sbOverlays:any = [];      // 지하철역 마커명
  ps:any; 
  bTitle:any = "";          // 하단 제목
  pItems:any = [];          // 하단 목록
  bottomHidden = true;  //하단 숨김 여부
  myMarker:any;             // 내위치 마커
  myCircle:any;                 // 내위치 원
    clusterer:any;
  trackerMarker:any = [];       // 지도에 노출된 마커
  categorys:any = [];           // 카테고리
  menuId:any = 0;         // 선택한 카테고리
  allItem:any = [];

  tabs:IScrollTab[] = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, private geolocation:Geolocation, 
                        private commonApi:CommonApi) {

       this.type = navParams.get("type");

       // 카테고리 목록을 불러온다
      this.commonApi.query("category/4").subscribe((res:any) => {
          this.categorys = res.categoryList;
          this.tabs.push({name:"전체", menuId:"0", selected:true});
          for(let ctg of this.categorys) {
              let category = { name:ctg.menuName, menuId:ctg.menuId};
              this.tabs.push(category);

          }
      });

        this.lat = this.commonApi.lat;
        this.lng = this.commonApi.lng;
        this.accuracy = this.commonApi.add;

      if(this.type == "my") {       // 내 주변 찾기
      } else if(this.type == "subway") {  // 지하철 찾기
            this.data = navParams.get("data");
      } else if(this.type == "place") {   // 주소 찾기
            this.data = navParams.get("data");
      }
  }

  tabChange(data: any) {
      console.log(data.menuId);
      this.menuId = data.selectedTab.menuId;
      for(let marker of this.markers) {
          marker.setMap(null);
      }

      this.markers = [];
      if(this.clusterer) {
          this.clusterer.clear();
      }
      
      this.initBrandList();
    //   this.circleDraw();
    if(!this.bottomHidden) {
        console.log(this.circle.getPosition());
        this.getPositionList(this.circle.getPosition());
    }
    //   this.bottomHidden = true;
    // this.selectedTab = data.selectedTab;
  }
  ionViewDidEnter() {
    // this.scrollTab.go2Tab(0);
  }
  ngAfterViewInit() {
      console.log("ionViewDidLoad");
    setTimeout(()=>{
        this.loadMap();
    }, 1000);
  }

 loadMap() {
    daum.maps.load(() => {
        console.log("daummap load");
        let watch = this.geolocation.watchPosition();
        watch.subscribe((data) => {
        // data can be a set of coordinates, or an error (if an error occurred).
            this.lat = data.coords.latitude;
            this.lng = data.coords.longitude;
            this.accuracy = data.coords.accuracy;
            console.log("watch : ", this.lat);
            console.log("watch: " , this.lng);
            this.addMyLocationMarker();
        });

        var options = {
            center : new daum.maps.LatLng(this.lat, this.lng),
            draggable: true,
            level: 6
        };

        this.maps = new daum.maps.Map(this.mapElement.nativeElement, options);
        this.maps.setDraggable(true);

        this.commonApi.query("main/subwayList").subscribe((res:any) => {
            this.initSubway(res);
        });

        this.initBrandList();
        this.addClickEvent();
        this.addZoomEvent();          // 줌 이벤트를 등록한다.
        this.addMoveEvent();          // 지도 이동 이벤트를 등록한다.
        this.addMyLocationMarker();
        // this.ps = new daum.maps.services.Places(this.maps);
        if(this.type == "my") {
            this.bTitle = "내 주변";
            this.circleDraw(new daum.maps.LatLng(this.lat, this.lng));
        } else if(this.type == "subway") {
            console.log(this.data);
            this.bTitle = this.data.sw_name + "역";
            var coords = new daum.maps.LatLng(this.data.latitude,this.data.longitude);
            this.maps.setCenter(coords);
            this.circleDraw(coords);
        } else if(this.type =="place") {
            console.log(this.data);
            this.addressSearch();
        }
    });

  }
 //주소로 좌표 검색
  addressSearch() {
      var geocoder = new daum.maps.services.Geocoder();
      geocoder.addressSearch(this.data.sw_name, (result,status) => {
          if(status == daum.maps.services.Status.OK) {
              var coords = new daum.maps.LatLng(result[0].y, result[0].x);
              this.maps.setCenter(coords);
          }
      });
  }

  initBrandList() {
      let params:any = {};
      if(this.menuId != "0") {
          params.menuId = this.menuId;
      }
      this.commonApi.query("brand/list", params).subscribe((data:any) => {
          this.item = data;
          this.setBrandMarker(data);
      });
  }

  setBrandMarker(item) {
      for(let data of item) {
            if(data.coordinate) {
                let coo = data.coordinate.split(",");
                let imageSrc = "assets/img/marker.png";
                let imageSize = new daum.maps.Size(50,50);
                let imageOprion = {offset: new daum.maps.Point(25,29)};
                var markerImage = new daum.maps.MarkerImage(imageSrc, imageSize, imageOprion);
                var marker  = new daum.maps.Marker({
                    //   map:this.maps,
                    position:new daum.maps.LatLng(coo[0], coo[1]),
                    title: data.brandCode,
                    zIndex: 9999,
                    image:markerImage
                });
                marker.setMap(this.maps);
                
                daum.maps.event.addListener(marker, 'click', () => {
                    this.openItem(data);
                });
                this.markers.push(marker);
            }
        }
        if(this.markers.length > 0) {
            this.addClustere();               //클러스터리를 등록한다.
        }
  }

  // 모든 지하철 마커
  initSubway(subways) {
      for(let subway of subways) {
            let center = this.maps.getCenter();
            let position = new daum.maps.LatLng(subway.latitude, subway.longitude);
            let imageSrc = "assets/img/subway.png";
            let imageSize = new daum.maps.Size(50,50);
            let imageOprion = {offset: new daum.maps.Point(25,29)};
            var markerImage = new daum.maps.MarkerImage(imageSrc, imageSize, imageOprion);
            var marker  = new daum.maps.Marker({
                //   map:this.maps,
                clickable:true,
                zIndex: 999,
                position: position,
                image:markerImage
            });
            marker.setMap(this.maps);
            
            daum.maps.event.addListener(marker, 'mousedown', () => {
                    this.circleDraw(position);
                    console.log(subway.swName);
                    this.bTitle = subway.swName + "역";
            });

                var content = '<div class="customoverlay">' +subway.swName + '역</div>';
                var customOverlay = new daum.maps.CustomOverlay({
                    clickable:true,
                    map:this.maps,
                    position:position,
                    content: content,
                    zIndex: 3,
                    yAnchor: 1
                });

                this.sbOverlays.push(customOverlay);
                this.sbMarkers.push(marker);
        }
        // this.maps.panTo(center);
  }


  addClickEvent() {
      daum.maps.event.addListener(this.maps, 'click', () => {
            this.bottomHidden = true;
            if(this.circle) {
                this.circle.setMap(null);
                this.circle = null;
            }
      });
  }
   addZoomEvent() {
      daum.maps.event.addListener(this.maps, 'zoom_changed', () => {
          this.bottomHidden = true;
            if(this.circle) {
                this.circle.setMap(null);
                this.circle = null;
            }
          let level = this.maps.getLevel();
          let visible = false;
          if(level > 7) {
                visible = false;
          } else {
              visible = true;
          }
            for(let marker of this.sbMarkers) {
                marker.setVisible(visible);       
            }
            for(let overlay of this.sbOverlays) {
                overlay.setVisible(visible);
            }
      });
  }
    // 지도 이동 이벤트
    addMoveEvent() {

        daum.maps.event.addListener(this.maps, 'bounds_changed', ()=>{
            console.log("bounds_changed");
             this.markerTraker();
        });

        daum.maps.event.addListener(this.maps, 'dragstart', () => {
            this.bottomHidden = true;
                if(this.circle) {
                    this.circle.setMap(null);
                    this.circle = null;
                }
        });
        daum.maps.event.addListener(this.maps, 'dragend', () => {
           console.log("dragstart");
        });
    }

  // 클러스터리 등록
  addClustere() {
        this.clusterer = new daum.maps.MarkerClusterer({
            map:this.maps,
            averageCenter:true,
            minLevel: 6,
            disableClickZoom:true,
            gridSize: 60
        });
        if(this.markers.length > 0) {
            this.clusterer.addMarkers(this.markers);
        }
        daum.maps.event.addListener(this.clusterer, 'clusterclick', (cluster) => {
            console.log(cluster);
            let markers = cluster.getMarkers();
            let bounds = new daum.maps.LatLngBounds();
            for(let m of markers) {
                console.log(m.getTitle());
                bounds.extend(m.getPosition());
            }
            this.maps.setBounds(bounds);
      });
  }

  // 지도타입 컨트롤의 지도 또는 스카이뷰 버튼을 클릭하면 호출되어 지도타입을 바꾸는 함수입니다
  setMapType(maptype) { 
      var roadmapControl = document.getElementById('btnRoadmap');
      var skyviewControl = document.getElementById('btnSkyview'); 
      if (maptype === 'roadmap') {
          this.maps.setMapTypeId(daum.maps.MapTypeId.ROADMAP);    
          roadmapControl.className = 'selected_btn';
          skyviewControl.className = 'btn';
      } else {
          this.maps.setMapTypeId(daum.maps.MapTypeId.HYBRID);    
          skyviewControl.className = 'selected_btn';
          roadmapControl.className = 'btn';
      }
  }

  // 원을 그린다
  circleDraw(position) {
    if(this.circle) {
        this.circle.setMap(null);
        this.circle = null;
    }
           
      this.circle = new daum.maps.Circle({
          center: position,
            radius: 750,        // 미터 단위의 원읠 반지름
            strokeWeight: 2,
            strokeColor: '#75BBFA',
            strokeOpacity: 1,
            fillColor: '#CFE7FF',
            fillOpacity: 0.7
      });
      this.circle.setMap(this.maps);
    this.getPositionList(position);
  }

  getPositionList(position) {
      let params:any = {};
      params.latitude = position.getLat();
      params.longitude = position.getLng();
      console.log(this.menuId);
      if(this.menuId != "0") {
          params.menuId = this.menuId;
      }
      this.commonApi.query("location", params).subscribe((res:any) => {
          console.log(res);
            this.pItems = res;
            this.bottomHidden = false;
      });
  }

  // 지도 확대, 축소 컨트롤에서 확대 버튼을 누르면 호출되어 지도를 확대하는 함수입니다
  zoomIn() {
      this.maps.setLevel( this.maps.getLevel() - 1);
  }

  // 지도 확대, 축소 컨트롤에서 축소 버튼을 누르면 호출되어 지도를 확대하는 함수입니다
  zoomOut() {
      this.maps.setLevel( this.maps.getLevel() + 1);
  }

  close() {
    this.navCtrl.pop();
  }


  // 지하철 선택시
  getSubwayList() {
    //   this.commonApi("location", {latitude: , longitude:})
  }

    openItem(item) {
        this.navCtrl.push(PDetailPage, {item:item.brandCode});
    }

    addMyLocationMarker() {
        console.log(this.accuracy);
        if(this.myMarker) {
             this.myMarker.setPosition(new daum.maps.LatLng(this.lat, this.lng));
        } else {
            let imageSrc = "assets/img/myLocation.png";
            let imageSize = new daum.maps.Size(10,10);
            let imageOprion = {offset: new daum.maps.Point(5,5)};
            var markerImage = new daum.maps.MarkerImage(imageSrc, imageSize, imageOprion);
            this.myMarker  = new daum.maps.Marker({
                //   map:this.maps,
                clickable:true,
                zIndex: 999,
                position: new daum.maps.LatLng(this.lat, this.lng),
                image:markerImage
            });
            this.myMarker.setMap(this.maps);
        }
        if(this.myCircle) {
            this.myCircle.setRadius(this.accuracy);
            this.myCircle.setPosition(new daum.maps.LatLng(this.lat, this.lng));
        } else {
                this.myCircle = new daum.maps.Circle({
                center: new daum.maps.LatLng(this.lat, this.lng),
                    radius: this.accuracy,        // 미터 단위의 원읠 반지름
                    strokeWeight: 2,
                    strokeColor: '#CFE7FF',
                    strokeOpacity: 1,
                    fillColor: '#CFE7FF',
                    fillOpacity: 0.5
            });
            this.myCircle.setMap(this.maps);
        }
    }

    goMyLocation() {
        if(this.circle) {
            this.circle.setMap(null);
            this.circle = null;
        }
        this.bottomHidden = true;
        let position = new daum.maps.LatLng(this.lat, this.lng);
        this.maps.setCenter(position);
        this.circleDraw(position);
    }

    ngOnDestroy() {
        console.log("Destroy");
    }

    // 보이는 지도 안에 마커가 있는지 확인한다.
    markerTraker() {
            let proj = this.maps.getProjection();
            let bounds = this.maps.getBounds();

            let sw = proj.pointFromCoords(bounds.getSouthWest());
            let ne = proj.pointFromCoords(bounds.getNorthEast());

            sw.x -= 30;
            sw.y += 30;

            ne.x += 30;
            ne.y -= 30;
            let extBounds = new daum.maps.LatLngBounds(proj.coordsFromPoint(sw), proj.coordsFromPoint(ne));
            this.trackerMarker = [];
            for(let marker of this.markers) {
                if(extBounds.contain(marker.getPosition())) {
                this.trackerMarker.push(marker.getTitle()); 
                }
            }
            if(this.trackerMarker.length > 0) {
                this.trackDisabled = false;
            } else {
                this.trackDisabled = true ;
            }
    }

    goList() {
        let datas = [];
        for(let item of this.pItems) {
            let data:any = {};
            data.id = item.brandCode;
            data.title = item.brandName;
            data.area = item.areaName;
            data.hashtag = item.hashtag;
            data.image = item.logo_url;
            data.type = "brand";
            datas.push(data);
        }

        this.navCtrl.push(ListPage, {datas: datas, viewTemplate:"2"});
    }
    goTrackerList() {
        this.markerTraker();
        if(this.trackerMarker.length > 0) {
             let datas = [];
            for(let item of this.item) {
                for(let tracker of this.trackerMarker) {
                    if(item.brandCode == tracker) {
                            let data:any = {};
                            data.id = item.brandCode;
                            data.title = item.brandName;
                            data.area = item.areaName;
                            data.hashtag = item.hashtag;
                            data.image = item.logo_url;
                            data.type = "brand";
                            datas.push(data);
                    }
                }
            }

            this.navCtrl.push(ListPage, {datas: datas, viewTemplate:"2"});
        }
    }

    closeSearch() {
        this.navCtrl.pop();
    }

    goSearch() {
        if(this.type == "subway" || this.type == 'place') {
            this.navCtrl.push(MapSearchPage, {type:this.type});
        } else {
            this.navCtrl.push(MapSearchPage, {type:"tag"});
        }
    }

}
