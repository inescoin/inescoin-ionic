import { Injectable, EventEmitter } from '@angular/core';
import { CryptoJsService } from './crypto/crypto-js.service';
import { HttpService } from './http/http.service';
import { Storage } from '@ionic/storage';
import { inescoinConfig } from '../../config/inescoin.config';

import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  onListUpdated: any = new EventEmitter();

  accounts = {};

  constructor(
    private storage: Storage,
    private cryptoJsService: CryptoJsService,
    private httpService: HttpService) {

      this.init();
  }

  create(password) {
  	let newAccount = this.cryptoJsService.generateKeys();
  	this.save(newAccount.address, newAccount, password);

    return newAccount;
  }

  async init() {
    let accounts: any = await this.storage.get(inescoinConfig.name + '-wallets');

    if (!accounts || accounts == 'undefined') {
      this.saveToStorage();
    } else {
      this.accounts = JSON.parse(accounts);
    }
  }

  open(data, password) {
    try {
      let wallet = this.cryptoJsService.decryptFromPassword(data, password);
      let result = wallet ? JSON.parse(wallet) : null;
      if (result) {
        this.accounts[result.address] = {
          data: data,
          publicKey: result.publicKey
        };
        this.saveToStorage();
      }

      return result;
    } catch(e) {
      return null;
    }
  }

  save(address, data, password) {
    try {
      let _data = JSON.stringify(data);
      let encrypted = this.cryptoJsService.encryptFromPassword(_data, password);
      let blob = new Blob([encrypted], {type: "text/plain;charset=utf-8"});

      this.accounts[address] = {
        data: encrypted,
        publicKey: data.publicKey
      };

      console.log('this.accounts[address]', this.accounts[address], data);
      this.saveToStorage();
      saveAs(blob, address + '.wallet');
    } catch(e) {
    }
  }

  saveToStorage() {
    this.storage.set(inescoinConfig.name + '-wallets', JSON.stringify(this.accounts))
    this.onListUpdated.emit(true);
  }

  saveToHomeStorage(accounts) {
    this.storage.set(inescoinConfig.name + '-home', JSON.stringify(accounts))
    this.onListUpdated.emit(true);
  }

  async getFromHomeStorage() {
    let home = await this.storage.get(inescoinConfig.name + '-home');
    if (home) {
      return JSON.parse(home);
    }

    return {};
  }

  async getFromWalletStorage() {
    let wallets = await this.storage.get(inescoinConfig.name + '-wallets');
    if (wallets) {
      return JSON.parse(wallets);
    }

    return {};
  }

  getWalletInfos(address) {
    return this.httpService.post('get-wallet-address-infos', {
      walletAddress: address
    })
  }

  getWalletAdressesInfos(addresses) {
    console.log('getWalletAdressesInfos', addresses);
    return this.httpService.post('get-wallet-addresses-infos', {
      walletAddresses: addresses
    })
  }
}
