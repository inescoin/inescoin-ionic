import { Injectable, EventEmitter } from '@angular/core';
import { CryptoJsService } from './crypto/crypto-js.service';
import { HttpService } from './http/http.service';
import { Storage } from '@ionic/storage';
import { inescoinConfig } from '../../config/inescoin.config';

import * as _ from 'lodash';

import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  onListUpdated: any = new EventEmitter();
  onSelected = new EventEmitter();

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

  openData(data, password) {
    let result = null;
    try {
      let wallet = this.cryptoJsService.decryptFromPassword(data, password);
      result = wallet ? JSON.parse(wallet) : null;
    } catch(e) {}

    return result;
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

  async removeWallet(address) {
    let home = await this.storage.get(inescoinConfig.name + '-home');
    let wallets = await this.storage.get(inescoinConfig.name + '-wallets');

    if (home) {
      home = JSON.parse(home);
    }

    if (wallets) {
      wallets = JSON.parse(wallets);
    }

    if (home[address]) {
      delete home[address];
      this.storage.set(inescoinConfig.name + '-home', JSON.stringify(home));
    }

    if (wallets[address]) {
      delete wallets[address];
      this.accounts = wallets;
      this.storage.set(inescoinConfig.name + '-wallets', JSON.stringify(wallets));
    }

    this.storage.remove(inescoinConfig.name + '-account-' + address);

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
    return this.httpService.post('get-wallet-addresses-infos', {
      walletAddresses: addresses
    })
  }
}
