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

import { ExportKeysComponent } from '../../../modals/export-keys/export-keys.component';

@Component({
  selector: 'app-wallet-account',
  templateUrl: './wallet-account.page.html',
  styleUrls: ['./wallet-account.page.scss']
})
export class WalletAccountPage implements OnInit {
  inProgress: boolean = false;

  pendingRemove: boolean = false;

  password: string = '';

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

    let account = this.navParams.get('account');
  	let address = account.address;
    if (this.walletService.accounts[address]) {
      this.account = await this._getFromCache(address);

      this.account.address = address;
      this.account.wallet = this.walletService.accounts[address];

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

  async openExportKeysModal() {
    const modal = await this.modalController.create({
      component: ExportKeysComponent,
      componentProps: {
        'wallet': {
          'address': this.account.address,
          'data': this.account.wallet.data,
          'publicKey': this.account.wallet.publicKey,
        }
      }
    });

    return await modal.present();
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

  async removeWallet() {
    this.inProgress = true;

    let data = this.walletService.openData(this.account.wallet.data, this.password);
    if (!data) {
      this.password = '';
      this.inProgress = false;

      const toast = await this.toastController.create({
        message: this.doorgetsTranslateService.instant('#Bad password'),
        duration: 2000
      });
      toast.present();
      return;
    }

    await this.walletService.removeWallet(this.account.address);

    const timer = async () => {
      this.dismiss();
      this.pendingRemove = false;
      this.inProgress = false;

      const toast = await this.toastController.create({
        message: this.doorgetsTranslateService.instant('#Wallet deleted'),
        duration: 2000
      });
      toast.present();
    };

    setTimeout(timer, 1000);
  }

  ngOnDestroy() {
    this.subjects.onGetWalletInfos && this.subjects.onGetWalletInfos.unsubscribe();
  }
}
