import { Component, OnInit } from '@angular/core';

import { ModalController, ToastController } from '@ionic/angular';
import * as _ from 'lodash';

import { DoorgetsTranslateService } from 'doorgets-ng-translate';

import { LanguageService } from '../../services/language.service';
import { WalletService } from '../../services/wallet.service';
import { ContactsService } from '../../services/contacts.service';
import { TransactionService } from '../../services/transaction.service';
import { ConfigService } from '../../services/config.service';
import { SelectContactComponent } from '../../modals/select-contact/select-contact.component';

import { ContactsCreatePage } from '../contacts/contacts-create/contacts-create.page';

import { inescoinConfig } from '../../../config/inescoin.config';

@Component({
  selector: 'app-send',
  templateUrl: './send.page.html',
  styleUrls: ['./send.page.scss'],
})
export class SendPage implements OnInit {

  inProgress: boolean = false;
	isSummaryStep: boolean = false;

  noWallet: boolean = false;
  error = '';
  badPassword: boolean = false;

	from = '';
  publicKey = '';
  data = '';

  password = '';

  fee = 0.001;

	transfers: any[] = [{
		to: '',
		amount: 0.000,
    item: null,
    walletId: ''
	}];

  subjects: any = {};

	contacts: any = [];
	wallet: any = {};
	addresses: any = {};
	inescoinConfig: any = inescoinConfig;

  constructor(
    private configService: ConfigService,
    private languageService: LanguageService,
    private doorgetsTranslateService: DoorgetsTranslateService,
    private toastController: ToastController,
    private transactionService: TransactionService,
  	private walletService: WalletService,
  	private contactsService: ContactsService,
    private modalController: ModalController) { }

  async ngOnInit() {
  	this.load();

    this.subjects.remoteResponse = this.transactionService.onRemoteResponse.subscribe((remoteResponse) => {
      this.inProgress = false;
      if (remoteResponse[0] && remoteResponse[0].error) {
        this.error = remoteResponse[0].error;
        console.log('Transaction ERROR', this.error);
        this.presentToast(this.doorgetsTranslateService.instant(remoteResponse[0].error));

      } else {
        console.log('Transaction OK !!!!!');
        this.presentToast(this.doorgetsTranslateService.instant('#Transaction sent!'));
        this.resetForm();
      }
    });

    this.subjects.onUpdatedLanguage = this.languageService.onUpdated.subscribe((langue) => {
      this.doorgetsTranslateService.setCurrent(langue);
    });

    this.subjects.onSelectedContact = this.contactsService.onSelected.subscribe((contact: any) => {
      console.log(contact);
      this.transfers[0].to = contact.address || '';
      this.transfers[0].label = contact.label || '';
      this.transfers[0].walletId = contact.walletId || '';
    });

    let current = await this.configService.getLanguage();
    this.doorgetsTranslateService.init({
      languages: ['en', 'fr', 'es'],
      current: current,
      default: current
    });
  }

  async load() {
    this.wallet = await this.walletService.getFromWalletStorage();
    this.addresses = await this.walletService.getFromHomeStorage();
    this.contacts = await this.contactsService.getFromStorage();

    if (this.from) {
      return;
    }

    this.noWallet = false;
    let walletsKeys = Object.keys(this.wallet);

    if (walletsKeys.length) {
      this.from = walletsKeys[0]
    } else {
      this.noWallet = true;
    }
	}

	getAdressesArray() {
  	let addresses = [];
  	for(let address of Object.keys(this.addresses)) {
  		addresses.push(this.addresses[address]);
  	}

  	return addresses;
  }

  getTotal() {
    let total = 0;
    _.forEach(this.transfers, (transfer) => {
      total += Math.floor(transfer.amount * 100000000) / 100000000;
    });

    return total + this.fee;
  }

  formataNumero(e: any) {
  	let separador: string = '.';
  	let decimais: number = 8;

  	if (!e.value) {
  		return 0.0
  	}

    let a:any = e.value.split('');
    let ns:string = '';
    a.forEach((c:any) => { if (!isNaN(c)) ns = ns + c; });
    ns = parseInt(ns).toString();
    if (ns.length < (decimais+1)) { ns = ('0'.repeat(decimais+1) + ns); ns = ns.slice((decimais+1)*-1); }
    let ans = ns.split('');
    let r = '';
    for (let i=0; i < ans.length; i++) if (i == ans.length - decimais) r = r + separador + ans[i]; else r = r + ans[i];
    e.value = r;
  }

  getAvailableBalance() {
    return this.addresses[this.from] && this.addresses[this.from].amount / 1000000000 || 0.0
  }

  showConfirmation() {
    this.isSummaryStep = true;
  }

  async send() {
    console.log('Send Transaction', this.transfers, this.from);
    this.inProgress = true;
    this.badPassword = false;

    this.error = '';
    let wallets = await this.walletService.getFromWalletStorage();

    this.data = '';
    this.publicKey = '';
    if (wallets && wallets[this.from]) {
      this.data = wallets[this.from].data;
      this.publicKey = wallets[this.from].publicKey;
    }


    let decrypted: any = this
      .transactionService
      .decryptWithPassword(this.data, this.password);

    if (!this.password) {
      this.badPassword = true;
      return;
    }

    if (decrypted) {
      decrypted = JSON.parse(decrypted);
      console.log('decrypted', decrypted);
      this.transactionService.sendTransaction(this.fee, this.transfers.map((transfer) => {
        return {
          amount: transfer.amount,
          to: transfer.item && transfer.item.address || transfer.to,
          walletId: transfer.walletId || transfer.item && transfer.item.walletId || ''
        };
      }), decrypted.address, decrypted.publicKey, decrypted.privateKey);
    } else {
      this.inProgress = false;
      this.badPassword = true;
    }
  }

  resetForm() {
    this.from = '';
    this.publicKey = '';
    this.data = '';
    this.fee = 0.001;
    this.transfers = [{
      to: '',
      amount: 0.000,
      item: null,
      walletId: ''
    }];

    this.isSummaryStep = false;
  }

  async openSelectContactModal() {
    const modal = await this.modalController.create({
      component: SelectContactComponent
    });

    return await modal.present();
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  isValidTransaction() {
    let isValidAmount = this.getTotal() > this.fee && this.getAvailableBalance();
    let isValidFrom = !!(this.from);
    let isValidTo = !!(this.transfers[0] && this.transfers[0].to);
    return isValidAmount && isValidFrom && isValidTo;
  }

  ngOnDestroy() {
    console.log('SendPage::destroy');
  }
}
