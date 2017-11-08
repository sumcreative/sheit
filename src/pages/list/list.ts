import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, MenuController, Keyboard, LoadingController } from 'ionic-angular';
import { CommonApi } from '../../providers/commonApi';
import { DetailPage } from '../detail/detail';
import {PDetailPage } from '../profile-detail/p-detail';
@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
})
export class ListPage {
    @ViewChild("searchInput") searchInput;

  menuId:any;
  searchHidden = true;
  navHidden = false;

  searchQuery: string = '';
  datas:any = [];
  type:any;
  viewTemplate = "1";
  items:any = [];
  constructor(public navCtrl: NavController, public params: NavParams, private menu:MenuController,
                    private keyboard:Keyboard, public commonApi:CommonApi, private loadingCtrl:LoadingController) {
     this.menuId = params.get("menuId");
     this.viewTemplate = params.get("viewTemplate");
     this.datas = params.get("datas");
     if(!this.datas || this.datas.length == 0) {
       this.getData();
     }
     
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListPage');
  }

  getData() {  
    let loading = this.loadingCtrl.create({
      content: ""
    });
    loading.present();
    this.commonApi.query("main/search", {search:this.searchQuery, menuId:this.menuId}).subscribe((res) => {
      console.log(res);
        this.datas = res;
        loading.dismiss();
    }, () => {loading.dismiss();}); 
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
      // this.searchHidden = true;
      // this.navHidden = false;
      // this.keyboard.close();
      this.navCtrl.pop();
    }

    goSearch() {
        if(this.searchQuery == "") {
            this.searchInput.setFocus();
        } else {           
            this.keyboard.close();
            this.getData();
        
            // this.closeSearch();
        }
    }

    goDetail(data) {
        let type = data.type;
        let id = data.id;
        if(type == 'brand') {
          this.navCtrl.push(PDetailPage, {item:id});
        } else {
            let loading = this.loadingCtrl.create({
              content: ""
            });
            loading.present();
           this.commonApi.query("product/detail/" + id, {type:type, id:id}).subscribe((res) => {
                loading.dismiss();
                this.navCtrl.push(DetailPage, {title:res.prodName, content:res.content, id:id, type:type});
            }, () => {loading.dismiss();});  
        }
    }

    searchClear() {
      this.searchQuery = "";
    }
}
