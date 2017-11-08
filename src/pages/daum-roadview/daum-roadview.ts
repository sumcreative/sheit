import { Component,ElementRef,ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


declare var daum;

@Component({
  selector: 'page-daum-roadview',
  templateUrl: 'daum-roadview.html',
})
export class DaumRoadviewPage {
  @ViewChild('map') mapElement: ElementRef;
  lat:any = 37.566826;
  lng:any = 126.9786567;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.lat = navParams.get("lat");
        this.lng = navParams.get("lng");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DaumRoadviewPage');
  }
  ngAfterViewInit() {
      console.log("ionViewDidLoad");
    setTimeout(()=>{
        this.loadMap();
    }, 1000);
  }

   loadMap() {
      // daum.maps.load(() => {
            var roadview = new daum.maps.Roadview(this.mapElement.nativeElement);
            var roadviewClient = new daum.maps.RoadviewClient();
            var position = new daum.maps.LatLng(this.lat, this.lng);

            roadviewClient.getNearestPanoId(position, 50, (panoId) => {
                roadview.setPanoId(panoId, position);
            });
      // });
   }
}
