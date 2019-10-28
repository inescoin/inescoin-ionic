import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { NavParams } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { DoorgetsTranslateService } from 'doorgets-ng-translate';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

import { WalletService } from '../../../services/wallet.service';
import { inescoinConfig } from '../../../../config/inescoin.config';

import { WalletTransferPage } from './wallet-transfer/wallet-transfer.page';

@Component({
  selector: 'app-wallet-account',
  templateUrl: './wallet-account.page.html',
  styleUrls: ['./wallet-account.page.scss']
})
export class WalletAccountPage implements OnInit {
  inescoinConfig = inescoinConfig;

	account: any = {
    hash: '',
    wallet: {
      label: '',
      walletId: ''
    },
    address: '',
    amount: 0,
    firstHeight: 0,
    lastHeight: 0,
    transactions: [],
    total: 0
  };

  subjects: any = {};

  constructor(
    private socialSharing: SocialSharing,
    private toastController: ToastController,
    private clipboard: Clipboard,
  	public navParams: NavParams,
    private doorgetsTranslateService: DoorgetsTranslateService,
    private storage: Storage,
    private walletService: WalletService,
    private modalController: ModalController) { }

  async ngOnInit() {
    console.log('socialSharing', this.socialSharing);

    let account = this.navParams.get('account');
  	let address = account.address;
    if (this.walletService.accounts[address]) {
      this.account = await this._getFromCache(address);

      this.account.address = address;
      this.account.wallet = this.walletService.accounts[address];
      console.log('this.account', this.account, this.walletService.accounts);

      this.subjects.onGetWalletInfos = this.walletService.getWalletInfos(address).subscribe((walletInfos: any) => {
        if (!walletInfos.error) {
          this.account.amount = walletInfos.amount;
          this.account.address = walletInfos.address;
          this.account.firstHeight = walletInfos.firstHeight;
          this.account.lastHeight = walletInfos.lastHeight;
          this.account.hash = walletInfos.hash;
          this.account.total = walletInfos.transfers.total;
          this.account.transactions = walletInfos.transfers.transactions;

          this._saveToCache(address, this.account);
        } else {
          this.storage.remove(inescoinConfig.name + '-account-' + address)
        }
      });
    }
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  async copy() {
    console.log('Copied', this.getQrCodeAddress());
    this.clipboard.copy(this.getQrCodeAddress());

    const toast = await this.toastController.create({
      message: this.doorgetsTranslateService.instant('#Copied!'),
      duration: 2000
    });
    toast.present();
  }

  async _getFromCache(address) {
    let account = await this.storage.get(inescoinConfig + '-account-' + address);
    if (!account) {
      return {
        hash: '',
        wallet: '',
        address: '',
        amount: 0,
        firstHeight: 0,
        lastHeight: 0,
        transactions: [],
        total: 0
      };
    } else {
      return JSON.parse(account);
    }
  }

  getQrCodeAddress() {
    return JSON.stringify({
      address: this.account.address,
      label: this.account.wallet.label,
      publicKey: this.account.wallet.publicKey,
      walletId: this.account.wallet.walletId,
    });
  }

  async openWalletTransferModal(transfer, account) {
    const modal = await this.modalController.create({
      component: WalletTransferPage,
      componentProps: {
        'transfer': transfer,
        'account': account
      }
    });

    return await modal.present();
  }

  private _saveToCache(address, data) {
    this.storage.set(inescoinConfig.name + '-account-' + address, JSON.stringify(data));
  }

  ngOnDestroy() {
    this.subjects.onGetWalletInfos && this.subjects.onGetWalletInfos.unsubscribe();
  }
}
