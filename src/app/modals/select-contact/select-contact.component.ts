import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { LanguageService } from '../../services/language.service';
import { ContactsService } from '../../services/contacts.service';
import { ConfigService } from '../../services/config.service';

import { ContactsCreatePage } from '../../account/contacts/contacts-create/contacts-create.page';

import { DoorgetsTranslateService } from 'doorgets-ng-translate';

@Component({
  selector: 'app-select-contact',
  templateUrl: './select-contact.component.html',
  styleUrls: ['./select-contact.component.scss'],
})
export class SelectContactComponent implements OnInit {
  contacts: any = [];
  temp: any = [];

  subjects: any = {};

  constructor(
    private configService: ConfigService,
    private doorgetsTranslateService: DoorgetsTranslateService,
    private languageService: LanguageService,
    private ref: ChangeDetectorRef,
    private contactsService: ContactsService,
  	private modalController: ModalController,) { }

  async ngOnInit() {
    this.load();

    this.subjects.contactsList = this.contactsService.onUpdated.subscribe(() => {
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

    this.subjects.onSelectedContact = this.contactsService.onSelected.subscribe((contact) => {
      // this.choose(contact);
      if (this.modalController && this.modalController.dismiss) {
	      setTimeout(() => {
	      	this.modalController.dismiss();
	      }, 1000);
      }
    });
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    const temp = this.temp.filter(function(d) {
      return d.label.toLowerCase().indexOf(val) !== -1
        || d.address.toLowerCase().indexOf(val) !== -1
        || d.publicKey.toLowerCase().indexOf(val) !== -1
        || !val;
    });

    this.contacts = temp;
  }

  async load() {
    this.contacts = await this.contactsService.getFromStorage();
    this.temp = this.contacts;

    this.ref.detectChanges();
  }

  choose(contact) {
  	this.contactsService.onSelected.emit(contact);
  	this.dismiss();
  }

  async openContactsCreateModal() {
    const modal = await this.modalController.create({
      component: ContactsCreatePage
    });

    return await modal.present();
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  ionViewWillLeave(){
  	this.subjects.onUpdatedLanguage && this.subjects.onUpdatedLanguage.unsubscribe();
  	this.subjects.contactsList && this.subjects.contactsList.unsubscribe();
  }
}
