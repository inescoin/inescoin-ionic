import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { QrScannerService } from '../../services/ui/qr-scanner.service';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { Platform } from '@ionic/angular';


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

  ionApp: any;

  constructor(
    private platform: Platform,
  	private qrScannerService: QrScannerService,
  	private qrScanner: QRScanner,
  	private modalController: ModalController) { }

  ngOnInit() {
    this.ionApp = <HTMLElement>document.getElementsByTagName('ion-app')[0];

    const startScanner = () => {
      this.scanSub = this.qrScanner.scan().subscribe((contact: string) => {

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

      this.qrScanner.show();
      this.ionApp.style.display = 'none';
    };

    this.platform.backButton.subscribe(() => {
      this.dismiss();
    });

    startScanner();
  }


  dismiss() {
    this.qrScanner.hide();
    this.scanSub && this.scanSub.unsubscribe();
    this.ionApp.style.display = 'block';

    this.modalController.dismiss();
  }

  showCamera() {
    (window.document.querySelector('ion-app') as HTMLElement).classList.add('cameraView');
  }

  hideCamera() {
    (window.document.querySelector('ion-app') as HTMLElement).classList.remove('cameraView');
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

     this.showCamera();

     this.qrScanner.prepare()
		  .then((status: QRScannerStatus) => {
		     if (status.authorized) {
		       // start scanning
		       this.scanSub = this.qrScanner.scan().subscribe((contact: string) => {

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
		  .catch((e: any) => {});
  }

  ionViewWillLeave(){
    this.qrScanner.hide(); // hide camera preview
    this.scanSub && this.scanSub.unsubscribe(); // stop scanning
    this.hideCamera();
  }
}
