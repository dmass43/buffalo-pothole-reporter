import { Component, ViewChild, ElementRef  } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Http, Headers } from '@angular/http';
//import { LocalNotifications } from '@ionic-native/local-notifications';
//import { TextToSpeech } from '@ionic-native/text-to-speech';
import 'rxjs/Rx';

declare var google: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('map') mapRef: ElementRef;
  data:any = [];
  potholes:any = [];
  points:any = [];

  constructor(public navCtrl: NavController, public geolocation: Geolocation, public http: Http) {
     this.http = http;
  }

  ionViewDidLoad(){
  //console.log(this.mapRef);
  //this.showMap();
  this.http.get('https://data.buffalony.gov/resource/p7e8-krif.json?$where=type%20=%20%22Pot%20Hole%20(Req_Serv)%22%20&$order=open_date%20DESC').map(res => res.json()).subscribe(data => {
        //let json = data;
        this.data = data; 
        //console.log(this.data);
        //this.potholes = this.data['potholes'];
        this.showMap(this.data);
        //this.addMarkers(this.potholes);
        //console.log(this.potholes);

    });

  //this.tts.speak('Approaching Pot Hole');
  //.then(() => console.log('Success'))
  //.catch((reason: any) => console.log(reason));

    //console.log(this.potholes);
  }

  showMap(points){
  console.log(this.points);
  this.geolocation.getCurrentPosition().then((resp) => {
   // 
   //
   console.log(resp.coords.latitude);
   var location = new google.maps.LatLng(resp.coords.latitude,  resp.coords.longitude);
   const options = {
       center: location,
       zoom: 15,
       mapTypeId: 'roadmap'
    }

    const map = new google.maps.Map(this.mapRef.nativeElement, options);
    
    var mark = this.addMarker(location, map, 'http://maps.google.com/mapfiles/kml/pal3/icon28.png',{open_date: '          '}, '       ');
    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
     // data can be a set of coordinates, or an error (if an error occurred).
     // data.coords.latitude
     // data.coords.longitude
     mark.setPosition( { lat: data.coords.latitude, lng: data.coords.longitude });
    });
    //console.log(this.data);
    for(var i = 0; i< points.length;i++){
       //console.log(points[i]);
       location = new google.maps.LatLng(points[i].latitude,points[i].longitude);
       if (points[i].status == "Open"){
        this.addMarker(location, map, 'http://maps.google.com/mapfiles/ms/icons/red-dot.png', points[i], 'Not Fixed  ');
        }else{
          this.addMarker(location, map, 'http://maps.google.com/mapfiles/ms/icons/green-dot.png', points[i], points[i].closed_date.substring(0,10));
          //console.log(points[i].closed_date);
        }
     }


  }).catch((error) => {
    console.log('Error getting location', error);
  });


    //var location = new google.maps.LatLng(42.880230, -78.878738);
  }

  addMarker(position, map , icon, pt, cls){
   var contentString = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h1 id="firstHeading" class="firstHeading">Date Reported'+' - '+ pt.open_date.substring(0,10)+'<br/> Date Fixed - '+ cls+'</h1>'+
            '<div id="bodyContent">'+
            '<p>'+''+'</p>'+
            '</div>'+
            '</div>';

     var infowindow = new google.maps.InfoWindow({
          content: contentString
        });

     var marker = new google.maps.Marker({position, map, icon});
     marker.addListener('click', function() {
          infowindow.open(map, marker);
        });
    return marker;
  }

  addMarkers(points){
  this.points = points;
     //for(var i = 0; i< points.length;i++){
       // console.log(points[i]);
     //}
  }


}
