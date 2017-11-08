import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Keyboard, AlertController, MenuController, LoadingController, ModalController } from 'ionic-angular';

import { SearchApi } from '../../providers/searchApi';
import { PDetailPage } from '../profile-detail/p-detail';
import { OptionsPage} from '../options/options';
import {MapPage} from '../map/map';
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
    @ViewChild("searchInput") searchInput;

 searchHidden = true;
 navHidden = false;
  imgUrl:string = "http://sumcrimage.cafe24.com";
  searchQuery: string = '';
  searchText:string = "";
  category:any;
  data:any = [];
  filterData:any = [];
  menuId:any;
  type:any;
  selectCategory:any = [];

  constructor(public nav: NavController, public navParams: NavParams, public searchApi:SearchApi,  public keyboard:Keyboard, public alertCtrl:AlertController, public menu:MenuController, public loadingCtrl:LoadingController, public modalCtrl:ModalController) {
      this.searchQuery = navParams.get("search");
      this.searchText = navParams.get("search");
      this.category = navParams.get("category");
      if(this.category) {
          this.menuId = this.category.menuId;
      }
      if(this.searchQuery != "") {
        this.search();
      }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }
  
  search() {  
    let loading = this.loadingCtrl.create({
        content: ""
    });
    loading.present();
    this.searchApi.query("main/search", {search:this.searchQuery, menuId:this.menuId}).subscribe((res) => {
      console.log(res);
      this.data = res;
      
      this.filterList();
        this.searchText = this.searchQuery;
        this.searchQuery = "";  
        loading.dismiss();
    }, () => { loading.dismiss(); }); 
  }


  openItem(item) {
      this.nav.push(PDetailPage, {item:item.id});
    }
    openMenu() {
        this.menu.open();
    }
  openSearch() {
      this.navHidden = true;
      this.searchHidden = false;
        setTimeout(() => {
            this.searchInput.setFocus();
        }, 500);
  }

  closeSearch() {
    this.nav.pop();
  }
    goSearch() {
        if(this.searchQuery == "") {
            this.searchInput.setFocus();
        } else {           
          this.search();
            this.keyboard.close();
        }
    }

    searchTap() {
      this.searchQuery = this.searchText;
      if(this.searchHidden) {
        this.openSearch();
      } else {
        this.search();
        this.keyboard.close();
      }
    }

    goMap() {
      for(let b of this.data) {
        let brand:any = {};
        brand.brandCode = b.id;
        brand.brandName = b.title;
        brand.coordinate = b.coordinate;
      }
      this.nav.push(MapPage, {title: this.searchText, item: this.data});
    }

    goOptions() {
      let optionModal = this.modalCtrl.create(OptionsPage, {selectCategory: this.selectCategory});
      optionModal .onDidDismiss(data => {
        console.log(data);
        if(data) {
          this.selectCategory = data;
          this.filterList();
        }
      });
      optionModal.present();
    }

    searchClear() {
      this.searchQuery = "";
    }

    filterList() {
      this.filterData = [];
      if(this.selectCategory.length > 0) {
          for(let item of this.data) {
              let menuIds = item.menuId;
              if(menuIds.length > 0) {
                for(let selectCtg of this.selectCategory) {
                    if(this.filterItems(menuIds, selectCtg.menuId).length > 0) {
                      this.filterData.push(item);
                      break;
                    }
                }
              }  
          }
      } else {
        this.filterData = this.data;
      }
    }

    filterItems(menuIds, search) {
      return menuIds.filter((item) => {
          return item == search;
      });
    }
}
