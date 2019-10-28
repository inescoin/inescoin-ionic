import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { LanguageService } from '../../services/language.service';
import { WalletService } from '../../services/wallet.service';
import { ConfigService } from '../../services/config.service';

import { WalletCreatePage } from './wallet-create/wallet-create.page';
import { WalletAccountPage } from './wallet-account/wallet-account.page';
import { WalletImportPage } from './wallet-import/wallet-import.page';

import * as _ from 'lodash';

import { DoorgetsTranslateService } from 'doorgets-ng-translate';

import { inescoinConfig } from '../../../config/inescoin.config';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],

})
export class WalletPage implements OnInit {

  inescoinConfig = inescoinConfig;
  total: number = 0;
  accounts = [];
  wallet = {};
  addresses = {};

  subjects: any = {};

  constructor(
    private configService: ConfigService,
    private languageService: LanguageService,
    private walletService: WalletService,
    private modalController: ModalController,
    private doorgetsTranslateService: DoorgetsTranslateService) { }

  async ngOnInit() {
    this.load();

    this.subjects.onListUpdated = this.walletService.onListUpdated.subscribe(() => {
      this.load();
    });

    this.subjects.onUpdatedLanguage = this.languageService.onUpdated.subscribe((langue) => {
      this.doorgetsTranslateService.setCurrent(langue);
    });

    let current = await this.configService.getLanguage();
    this.doorgetsTranslateService.init({
      languages: ['en', 'fr', 'es'],
      current: current,
      default: current
    });
  }

  async openWalletCreateModal() {
    const modal = await this.modalController.create({
      component: WalletCreatePage
    });

    return await modal.present();
  }

  async openImportAccountModal() {
    const modal = await this.modalController.create({
      component: WalletImportPage
    });

    return await modal.present();
  }

  async openWalletAccountModal(account) {
    const modal = await this.modalController.create({
      component: WalletAccountPage,
      componentProps: {
        'account': account
      }
    });

    return await modal.present();
  }

  getWalletAdressesInfos() {
    console.log('this.wallet', this.wallet);
    return Object.keys(this.wallet).join(',');
  }

  async load() {
    this.addresses = await this.walletService.getFromHomeStorage();
    this.wallet = await this.walletService.getFromWalletStorage();
    this.accounts = this.getAccounts();

    if (!this.subjects.getWalletAdressesInfos) {
      this.subjects.getWalletAdressesInfos = this.walletService.getWalletAdressesInfos(this.getWalletAdressesInfos())
        .subscribe((addresses) => {
          this.walletService.saveToHomeStorage(addresses);
          this.addresses = addresses;
          console.log('addresses', addresses);
      });
    }
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

  doRefresh(event) {
    this.subjects.getWalletAdressesInfos && this.subjects.getWalletAdressesInfos.unsubscribe();

    this.subjects.getWalletAdressesInfos = this.walletService.getWalletAdressesInfos(this.getWalletAdressesInfos())
      .subscribe((addresses) => {
        this.walletService.saveToHomeStorage(addresses);
        this.addresses = addresses;
        console.log('addresses', addresses);
        event.target.complete();
    });
  }

  ngOnDestroy() {
    console.log('WalletPage::destroy');
    this.subjects.onUpdatedLanguage && this.subjects.onUpdatedLanguage.unsubscribe();
    this.subjects.onListUpdated && this.subjects.onListUpdated.unsubscribe();
    this.subjects.getWalletAdressesInfos && this.subjects.getWalletAdressesInfos.unsubscribe();
  }
}
