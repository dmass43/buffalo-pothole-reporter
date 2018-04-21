import { Component } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Geolocation } from '@ionic-native/geolocation';


@Component({
  selector: 'page-list',
  templateUrl: 'report.html'
})
export class ReportPage {

  data:any = {};
  selectedItem: any;
  icons: string;
  items: Array<{title: string, note: string, icon: string}>;
  imageURI:any;
  imageFileName:any;
  lastImage: string = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, public camera: Camera, public transfer: FileTransfer, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public http: Http, public geolocation: Geolocation) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
    this.icons = "";
    this.data.pic = '';
    this.data.response = '';
    this.http = http;
  }

     

  takePicture(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true
    }

    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64:
     let base64Image = 'data:image/jpeg;base64,' + imageData;
     this.icons = base64Image;
     this.uploadFile(this.icons);
    }, (err) => {
     // Handle error
    });
  }



  uploadFile(imgUri) {
    let loader = this.loadingCtrl.create({
      content: "Uploading..."
    });
    loader.present();
    this.geolocation.getCurrentPosition().then((resp) => {
     console.log(resp.coords.latitude);
     var link = 'http://162.243.101.15:5000/upload';
     var myData = JSON.stringify({pic: imgUri, lat: resp.coords.latitude, lon: resp.coords.longitude});
     console.log(myData);
     let headers = new Headers();
     headers.append('Content-Type','application/json');
     headers.append('Accept','application/json');
   
   this.http.post(link, myData, {headers: headers})
   .subscribe(data => {
     this.data.response = data["_body"]; //https://stackoverflow.com/questions/39574305/property-body-does-not-exist-on-type-response
     loader.dismiss();
     this.presentToast("Image uploaded successfully");
     }, error => {
     console.log("Oooops!");
     loader.dismiss();
     });
   


    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 6000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }



}
