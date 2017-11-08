import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { CommonApi} from '../../providers/commonApi';
import {SearchPage} from '../search/search';
import {MapPage} from '../map/map';

@Component({
  selector: 'page-map-search',
  templateUrl: 'map-search.html',
})
export class MapSearchPage {
  type:any = "place";
  searchQuery:any="";
  subwayList:any = [];
  areaList:any = [];
  tagList:any = [];
  searchSubway:any = [];
  searchArea:any = [];
  searchTag:any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public commonApi:CommonApi, public storage:Storage) {
    this.type = navParams.get("type");
    this.storage.get('subway').then((val) => {
        if(val) {
          this.searchSubway = val;
        }
    });
    this.storage.get('area').then((val) => {
        if(val) {
          this.searchArea = val;
        }
    });
    this.storage.get('tag').then((val) => {
        if(val) {
          console.log(val);
          this.searchTag = val;
        }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapSearchPage');
  }

  goMap(item) {
    if(this.type == 'tag') {
        if(this.searchTag.length == 0) {
          this.searchTag.push(item);
        } else {
          let tmpTag = [];
          tmpTag.push(item);
          for(let tag of this.searchTag) {
            if(tag != item) {
                tmpTag.push(tag);
            }
          }
          this.searchTag = tmpTag;
        }
        this.storage.set("tag", this.searchTag);
        // SEARCH 이동
         this.navCtrl.push(SearchPage, {search:item});
         this.navCtrl.remove(1, this.navCtrl.length()-1, {animate: false});
    } else {
      console.log(item);
        if(this.type == 'place') {
          if(this.searchArea.length == 0) {
                this.searchArea.push(item);
              } else {
                let tmpArea = [];
                tmpArea.push(item);
                for(let area of this.searchArea) {
                  if(area.sw_name != item.sw_name) {
                      tmpArea.push(area);
                  }
                }
                this.searchArea = tmpArea;
              }
              this.storage.set("area", this.searchArea);
        } else {
              if(this.searchSubway.length == 0) {
                this.searchSubway.push(item);
              } else {
                let tmpSubway = [];
                tmpSubway.push(item);
                for(let subway of this.searchSubway) {
                  if(subway.sw_name != item.sw_name) {
                      tmpSubway.push(subway);
                  }
                }
                this.searchSubway = tmpSubway;
              }
              this.storage.set("subway", this.searchSubway);
        }
        
        this.navCtrl.push(MapPage, {type:this.type, data: item});

        // this.commonApi.query("brand/list").subscribe((data:any) => {
        //     // this.navCtrl.pop({animate:false}).then(() => {
        //       this.navCtrl.push(MapPage, {title: title, item: data, type:this.type, lat: 37.481072, lng:126.882343});
        //       this.navCtrl.remove(1, this.navCtrl.length()-1, {animate: false});
        //     // });
            
        // });
    }

  }
  removeSearch() {
    if(this.type == "tag") {
        this.searchTag = [];
        this.storage.set("tag", this.searchTag);
    } else if(this.type == "place") {
      this.searchArea = [];
        this.storage.set("area", this.searchArea);
    } else if(this.type == "subway") {
    this.searchSubway = [];
        this.storage.set("subway", this.searchSubway);
    }
  }
  closeSearch() {
    this.navCtrl.pop();
  }
  
  searchClear() {
    this.searchQuery = "";
  }

  goSearch() {
    if(this.searchQuery) {
      this.commonApi.query("main/subway_search", {search:this.searchQuery}).subscribe((res:any) => {
            console.log(res);
            this.subwayList = res.subwayList;
            this.areaList  = res.areaList;
            this.tagList = res.tagList;
      });
    }
  }
}
