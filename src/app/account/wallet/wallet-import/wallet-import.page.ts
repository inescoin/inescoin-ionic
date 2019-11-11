import { Component, OnInit } from '@angular/core';
import { DoorgetsTranslateService } from 'doorgets-ng-translate';
import { WalletService } from '../../../services/wallet.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-wallet-import',
  templateUrl: './wallet-import.page.html',
  styleUrls: ['./wallet-import.page.scss'],
})
export class WalletImportPage implements OnInit {
	file: File;
	account = {};
	password: string = '';

	error = {
		file: ''
	};

  constructor(
  	private walletService: WalletService,
  	private modalController: ModalController,
  	private doorgetsTranslateService: DoorgetsTranslateService,) { }

  ngOnInit() {}

  loadWallet(event) {
  	this.file = event.target && event.target.files && event.target.files[0];
  	this.account = {};
  	this.error.file = '';
  }

  checkPassword() {
  	let fileReader = new FileReader();
    fileReader.onload = (e) => {
      let content = fileReader.result;
      let wallet = this.walletService.open(content, this.password);
      if (!wallet) {
      	this.error.file = 'File or password error';
      }

      try {
	      this.account = wallet;
      } catch(e) {
      	this.error = e;
      }

      this.password = '';
  		this.file = undefined;

  		if (this.account) {
	        this.dismiss();
  		}
    }

    fileReader.readAsText(this.file);
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  importAccount() {
  	this.checkPassword();
  }
}
