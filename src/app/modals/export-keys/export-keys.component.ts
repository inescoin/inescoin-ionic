import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-export-keys',
  templateUrl: './export-keys.component.html',
  styleUrls: ['./export-keys.component.scss'],
})
export class ExportKeysComponent implements OnInit {
	wallet: any = {};

  constructor(
  	private navParams: NavParams,
  	private modalController: ModalController,) { }

  ngOnInit() {
  	this.wallet = this.navParams.get('wallet');
  }

  getQrCodeWallet() {
		return JSON.stringify(this.wallet);
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }
}
