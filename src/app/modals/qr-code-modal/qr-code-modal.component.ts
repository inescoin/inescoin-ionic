import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { QrScannerService } from '../../services/ui/qr-scanner.service';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';


@Component({
  selector: 'app-qr-code-modal',
  templateUrl: './qr-code-modal.component.html',
  styleUrls: ['./qr-code-modal.component.scss'],
})
export class QrCodeModalComponent implements OnInit {

  private isBackMode: boolean = true;
  private isFlashLightOn: boolean = false;
  private scanSub: any;

  hasCameras = false;
  hasPermission: boolean;
  qrResultString: string;

  availableDevices: MediaDeviceInfo[];
  selectedDevice: MediaDeviceInfo;

  constructor(
  	private qrScannerService: QrScannerService,
  	private qrScanner: QRScanner,
  	private modalController: ModalController) { }

  ngOnInit() {}

  dismiss() {
    this.modalController.dismiss();
  }

  showCamera() {
    (window.document.querySelector('ion-app') as HTMLElement).classList.add('cameraView');
    console.log(window.document.querySelector('ion-app').classList.contains('cameraView'));
  }

  hideCamera() {
    (window.document.querySelector('ion-app') as HTMLElement).classList.remove('cameraView');
    console.log(window.document.querySelector('ion-app').classList.contains('cameraView'));
  }

  toggleFlashLight(){
    this.isFlashLightOn = !this.isFlashLightOn;
    if(this.isFlashLightOn){
      this.qrScanner.enableLight();
    }
    else{
      this.qrScanner.disableLight();
    }
  }

  toggleCamera(){
    this.isBackMode =  !this.isBackMode;
    if(this.isBackMode){
      this.qrScanner.useFrontCamera();
    }
    else{
      this.qrScanner.useBackCamera();
    }
  }

  ionViewWillEnter(){
			console.log('--------------------++++++++++++++++++');
			console.log('--------------------++++++++++++++++++');
			console.log('--------------------++++++++++++++++++');
			console.log('--------------------++++++++++++++++++');

     this.showCamera();

     this.qrScanner.prepare()
		  .then((status: QRScannerStatus) => {
		     if (status.authorized) {
		       // start scanning
		       this.scanSub = this.qrScanner.scan().subscribe((contact: string) => {
			        console.log('Scanned contact');
			        console.log(contact);

							let _contact;
							try {
							  _contact= JSON.parse(contact);
							} catch(e) {}

							if (_contact) {
							 this.qrScannerService.onScan.emit({
							 	contact: _contact
							 });
							}

		         	this.dismiss();
		       });

	       		console.log('----------------------||||||||||||||||||||||||||');
			  		console.log('----------------------||||||||||||||||||||||||||');
			  		console.log('----------------------||||||||||||||||||||||||||');
			  		console.log('----------------------||||||||||||||||||||||||||');
		        this.qrScanner.show();

		     } else if (status.denied) {
		       // camera permission was permanently denied
		       // you must use QRScanner.openSettings() method to guide the user to the settings page
		       // then they can grant the permission from there
		         this.dismiss();
		     } else {
		       // permission was denied, but not permanently. You can ask for permission again at a later time.
		         this.dismiss();
		     }
		  })
		  .catch((e: any) => console.log('Error is', e));
  }

  ionViewWillLeave(){
    this.qrScanner.hide(); // hide camera preview
    this.scanSub && this.scanSub.unsubscribe(); // stop scanning
    this.hideCamera();
  }
}
