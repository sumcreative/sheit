import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NoticeApi } from '../../providers/noticeApi';
import { DetailPage } from '../detail/detail';

@Component({
  selector: 'page-notice',
  templateUrl: 'notice.html',
})

export class NoticePage {
   notice:any = [];
  constructor(public nav:NavController, public navParams: NavParams, public noticeApi:NoticeApi) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NoticePage');
    this.noticeApi.query("notice/list").subscribe((data:any) =>  {
      this.notice = data;
    }); 
  }

    itemTapped(item) {
      this.nav.push(DetailPage, {item:item.content, title:item.subject});
    }
}
