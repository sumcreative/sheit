import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-photoviewer',
  templateUrl: 'photoviewer.html',
})
export class PhotoviewerPage {
  photos:any = [];
  index:any = 0;
  constructor(public viewCtrl: ViewController, public params: NavParams) {
      this.photos = params.get("photos");
      this.index = params.get("index");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PhotoviewerPage');
  }

  closePhoto() {
    this.viewCtrl.dismiss();
  }
}
