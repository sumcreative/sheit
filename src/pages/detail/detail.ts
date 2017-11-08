import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {
  content:any;
  title:any = "";

  constructor(public navCtrl: NavController, public params: NavParams, public domSanitizer:DomSanitizer) {
     this.content = params.get("content");
     this.title = params.get("title"); 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailPage');
  }

    ionViewDidEnter() {
        this.content = this.domSanitizer.bypassSecurityTrustHtml(this.content);
    }
}
