import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { WalletService } from '../../../services/wallet.service';

@Component({
  selector: 'app-wallet-create',
  templateUrl: './wallet-create.page.html',
  styleUrls: ['./wallet-create.page.scss'],
})
export class WalletCreatePage implements OnInit {
  password: string = '';

  constructor(
    private walletService: WalletService,
    private modalController: ModalController) { }

  ngOnInit() {}

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  create() {
    if (this.password) {
      let wallet = this.walletService.create(this.password);
      if (wallet) {
        this.password = '';
        this.dismiss();
      }
    }
  }
}
