import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'page-notice-detail',
  templateUrl: 'notice-detail.html',
})
export class NoticeDetailPage {
  notice:any;
  content:any;
  constructor(public nav: NavController, public navParams: NavParams, public domSanitizer:DomSanitizer) {
          this.notice = navParams.get("item");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NoticeDetailPage');
    this.content = this.domSanitizer.bypassSecurityTrustHtml(this.notice.content);
  }
}
