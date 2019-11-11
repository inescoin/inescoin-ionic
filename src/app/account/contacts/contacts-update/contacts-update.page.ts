import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { ModalController, ToastController } from '@ionic/angular';
import { NavParams } from '@ionic/angular';

import { ContactsService } from '../../../services/contacts.service';

import { DoorgetsTranslateService } from 'doorgets-ng-translate';

import * as _ from 'lodash';

@Component({
  selector: 'app-contacts-update',
  templateUrl: './contacts-update.page.html',
  styleUrls: ['./contacts-update.page.scss'],
})
export class ContactsUpdatePage implements OnInit {

  index: number;

  pendingRemove: boolean = false;

  contact = {
		label: '',
		address: '',
		publicKey: '',
		walletId: ''
	};

  form: FormGroup;

  subjects: any = {};

  errors: any = {
    address: false
  };

  constructor(
    private clipboard: Clipboard,
    private toastController: ToastController,
    public navParams: NavParams,
    private doorgetsTranslateService: DoorgetsTranslateService,
    private contactsService: ContactsService,
    private modalController: ModalController) { }

  ngOnInit() {
    let contact = this.navParams.get('contact');
    this.index = this.navParams.get('index');
    this.contact = contact;


    this.form = new FormGroup({
      label: new FormControl(contact.label, Validators.required),
      address: new FormControl(contact.address, Validators.compose([
        Validators.required,
        Validators.pattern('^0x[a-fA-F0-9]{40}$')
      ])),
      publicKey: new FormControl(contact.publicKey),
      walletId: new FormControl(contact.walletId)
    });
  }

  updateContact() {
    this.contactsService.contacts[this.index] = this.form.value;
    this.contactsService.saveToStorage(this.contactsService.contacts);

    setTimeout(() => {
      this.dismiss();
    }, 1000);
  }

  async copy() {
    this.clipboard.copy(this.getQrContact());

    const toast = await this.toastController.create({
      message: this.doorgetsTranslateService.instant('#Copied!'),
      duration: 2000
    });
    toast.present();
  }

  removeContact() {

    _.remove(this.contactsService.contacts, this.form.value);

    this.contactsService.saveToStorage(this.contactsService.contacts);

    setTimeout(() => {
      this.dismiss();
      this.pendingRemove = false;
    }, 1000);
  }

  getQrContact() {
    return JSON.stringify(this.form.value);
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }
}
