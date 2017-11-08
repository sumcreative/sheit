import {Component} from "@angular/core";
import {NavController,NavParams} from 'ionic-angular';

 @Component({
  selector:'page-rules',
  templateUrl: 'rules.html',
})

export class RulesPage {
    public type = "rules1";
    constructor(public navCtrl: NavController, public params: NavParams) {
        this.type = params.get("type");
    }
}