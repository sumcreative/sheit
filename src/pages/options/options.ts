import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { CommonApi } from '../../providers/commonApi';

@Component({
  selector: 'page-options',
  templateUrl: 'options.html',
})
export class OptionsPage {
  categorys:any = [];
  selectCategory:any = [];
  constructor(public viewCtrl: ViewController, public navParams: NavParams, public commonApi:CommonApi) {
          this.selectCategory = navParams.get("selectCategory");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OptionsPage', this.selectCategory);
  
    this.commonApi.query("category/" + "4").subscribe((res:any) => {
          this.categorys = res.categoryList;
          if(this.selectCategory.length > 0) {
            for(let ctg of this.categorys) {
                for(let category of this.selectCategory) {
                    if(ctg.menuId == category.menuId) {
                          ctg.checked = true;
                    }
                }
            }
          }
    });
  }

  checkHashtag(category) {
    // if(!category.checked) {
      category.checked = !category.checked;
      console.log(category);
    // }  else {
      // category.checked = false;
    // }
  }

  dismiss() {
      let data:any = [];
      for(let ctg of this.categorys) {
        if(ctg.checked) {
          data.push(ctg);
        }
      }
      this.viewCtrl.dismiss(data);
  }
  ngOnDestroy() {
      let data:any = [];
      for(let ctg of this.categorys) {
        if(ctg.checked) {
          data.push(ctg);
        }
      }
      this.viewCtrl.dismiss(data);
  }

}
