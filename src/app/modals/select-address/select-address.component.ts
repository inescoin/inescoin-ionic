import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { WalletService } from '../../services/wallet.service';
import { inescoinConfig } from '../../../config/inescoin.config';

import * as _ from 'lodash';

@Component({
  selector: 'app-select-address',
  templateUrl: './select-address.component.html',
  styleUrls: ['./select-address.component.scss'],
})
export class SelectAddressComponent implements OnInit {
	inescoinConfig = inescoinConfig;

  accounts = [];

  total: any = 0;

	addresses: any = {};
	wallet: any = {};

  constructor(
  	private walletService: WalletService,
  	private modalController: ModalController,
  	private ref: ChangeDetectorRef) { }


  ngOnInit() {
  	this.load();
  }

  async load() {
		this.addresses = await this.walletService.getFromHomeStorage();
    this.wallet = await this.walletService.getFromWalletStorage();
    this.accounts = this.getAccounts();
    this.ref.detectChanges();
  }

  choose(wallet) {
  	this.walletService.onSelected.emit({
  		address: wallet.address,
  		publicKey: this.wallet[wallet.address].publicKey
  	});
  	this.dismiss();
  }

  getAccounts() {
    let i = 1;
    let wallet = [];
    let total = 0;

    for (let key of Object.keys(this.wallet)) {
      wallet.push({
        address: this.addresses[key] && this.addresses[key].address || key,
        amount: this.addresses[key] && this.addresses[key].amount || '0.00'
      });

      total += this.addresses[key] && this.addresses[key].amount || 0;
      i++;
    }

    this.total = total;
    return _.orderBy(wallet, ['amount'], ['desc']);
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  ionViewWillLeave(){
  }

}
