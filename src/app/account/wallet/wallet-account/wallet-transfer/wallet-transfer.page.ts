import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { WalletService } from '../../../../services/wallet.service';

import { inescoinConfig } from '../../../../../config/inescoin.config';

@Component({
  selector: 'app-wallet-transfer',
  templateUrl: './wallet-transfer.page.html',
  styleUrls: ['./wallet-transfer.page.scss'],
})
export class WalletTransferPage implements OnInit {
  inescoinConfig = inescoinConfig;

  transfer: any = {};
  account: any = {};

  constructor(
  	public navParams: NavParams,
    private modalController: ModalController) { }

  ngOnInit() {
    this.transfer = this.navParams.get('transfer');
    this.account = this.navParams.get('account');
  }

  getInfos() {
    return Object.keys(this.transfer);
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }
}
