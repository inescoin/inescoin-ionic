import { Injectable, EventEmitter } from '@angular/core';
import { inescoinConfig } from '../../config/inescoin.config';
import { Storage } from '@ionic/storage';
import * as uuid from 'uuid';


@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  onUpdated = new EventEmitter();
  onSelected = new EventEmitter();

	contacts = [];

  constructor(private storage: Storage) {
  	this.load();
  }

  async load() {
    let contacts = await this.storage.get(inescoinConfig.name + '-contacts');
    try {
      if (!contacts || contacts == 'undefined') {
        this.saveToStorage();
      } else {
        this.contacts = JSON.parse(contacts);
      }
    } catch(e) {}
  }

  async saveToStorage(contacts?) {
    contacts = contacts || this.contacts;
    this.storage.set(inescoinConfig.name + '-contacts', JSON.stringify(contacts));

    let storage = await this.getFromStorage();
    this.onUpdated.emit(true);
  }

  async add(contact) {
    console.log('contact added');
    console.log(JSON.stringify(contact));

    const chars = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"];
    const id: any = [...Array(10)].map(i=>(~~(Math.random()*36)).toString(36)).join('');

  	this.contacts.push({
      id: id,
      label: contact.label,
      address: contact.address,
      publicKey: contact.publicKey,
      walletId: contact.walletId,
  	});

  	this.saveToStorage(this.contacts);
  }

  async getFromStorage() {
    let contacts = await this.storage.get(inescoinConfig.name + '-contacts');
    if (contacts) {
      return JSON.parse(contacts);
    }

    return [];
  }
}
