import { Component } from '@angular/core';
import { NavController, NavParams, Keyboard } from 'ionic-angular';

import { CommonApi } from '../../providers/commonApi';

@Component({
  selector: 'page-mypage-wish',
  templateUrl: 'mypage-wish.html',
})
export class MypageWishPage {
  searchQuery: string = '';
  datas:any = [];
  searchList = [];
  edit:any = false;
  constructor(public nav: NavController, public navParams: NavParams, public commonApi:CommonApi, public keyboard:Keyboard) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MypageApplyPage');
  }

    ngOnInit() {
        this.getData();
    }

    getData() {
      this.commonApi.query("wish/list_brand").subscribe((data:any) => {
        console.log(data);
            this.datas = data;
            this.searchList = data;
        });
    }

    deleteWish(wish) {
      this.commonApi.delete("wish/delete_brand?wish_id="+wish.wishId).subscribe((data:any) => {
          this.getData();
      });
    }

  itemTapped(item) {
    //  this.nav.push(DetailPage, {item:item});
  }

  editStat() {
    this.edit = !this.edit;
  }

  onOuterClick(event: {srcEvent: Event}, item) {
    let srcEvent = event && event.srcEvent;
    let fire = (!srcEvent) || (!srcEvent.defaultPrevented);
    if(fire) {
      console.log("onOuterClick");
      //  this.nav.push(DetailPage, {item:item});
    }
  }

  onInnerClick(event:Event, wish) {
    if(event && event.stopPropagation) {
      console.log("onInnerClick - stopPRopagation");
      event.stopPropagation();
    }
    console.log("onInnerClick")
    this.deleteWish(wish);
  }

  onInnerPointerUp(event:PointerEvent) {
    if(event && event.preventDefault) {
      event.preventDefault();
    }
    console.log("onInnerPointerUp");
  }

  closeSearch() {
      // this.searchHidden = true;
      // this.navHidden = false;
      // this.keyboard.close();
      this.nav.pop();
    }

    getItems(ev: any) {
        var code = ev.keyCode || ev.which;
        if(code == 13) {
            this.keyboard.close();
        }
        console.log(ev);
        let val = ev.target.value;
        // clearTimeout(this.timer);
        if (this.searchQuery && this.searchQuery.trim() != '') {
            this.searchList = this.datas.filter((data) => {
                let searchStr = JSON.stringify(data);
                return (searchStr.toLowerCase().indexOf(val.toLowerCase()) > -1);
            });
        } else {
            this.searchList = this.datas;
        }
    }
}

