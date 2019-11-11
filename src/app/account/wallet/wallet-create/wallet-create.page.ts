import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { WalletService } from '../../../services/wallet.service';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { Platform } from '@ionic/angular';
import { DoorgetsTranslateService } from 'doorgets-ng-translate';

@Component({
  selector: 'app-wallet-create',
  templateUrl: './wallet-create.page.html',
  styleUrls: ['./wallet-create.page.scss'],
})
export class WalletCreatePage implements OnInit {
  wallet: any = {};
  password: string = '';
  private scanSub: any;
  ionApp: any;

  constructor(
    private ref: ChangeDetectorRef,
    private platform: Platform,
    private qrScanner: QRScanner,
    private walletService: WalletService,
    private doorgetsTranslateService: DoorgetsTranslateService,
    private toastController: ToastController,
    private modalController: ModalController) { }

  ngOnInit() {}

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  scanQRCode() {
    this.ionApp = <HTMLElement>document.getElementsByTagName('ion-app')[0];

    const startScanner = () => {
      this.scanSub = this.qrScanner.scan().subscribe((wallet: string) => {
        try {
          this.wallet = JSON.parse(wallet) || {};
        } catch (e) {}

        this.closeCamera();
        this.ref.detectChanges();
      });

      this.qrScanner.show();
      this.ionApp.style.display = 'none';
    };

    this.platform.backButton.subscribe(() => {
      this.closeCamera();
    });

    startScanner();
  }

  closeCamera() {
    this.qrScanner.hide();
    this.scanSub && this.scanSub.unsubscribe();
    this.ionApp.style.display = 'block';
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  create() {
    if (this.password) {
      if (this.wallet && this.wallet.address) {
        let wallet = this.walletService.open(this.wallet.data, this.password);

        if (!wallet) {
          this.password = '';
          this.wallet = {};
          this.presentToast(this.doorgetsTranslateService.instant('#Bad password'));
        } else {
          this.walletService.save(this.wallet.address, wallet, this.password);
          this.presentToast(this.doorgetsTranslateService.instant('#Wallet created') + ' !');
          this.dismiss();
        }
      } else {
        let wallet = this.walletService.create(this.password);
        if (wallet) {
          this.password = '';
          this.presentToast(this.doorgetsTranslateService.instant('#Wallet created') + ' !');
          this.dismiss();
        }
      }
    }
  }
}
