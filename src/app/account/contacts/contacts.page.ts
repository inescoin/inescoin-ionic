import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { LanguageService } from '../../services/language.service';
import { ContactsService } from '../../services/contacts.service';
import { ConfigService } from '../../services/config.service';

import { ContactsCreatePage } from './contacts-create/contacts-create.page';
import { ContactsUpdatePage } from './contacts-update/contacts-update.page';

import { DoorgetsTranslateService } from 'doorgets-ng-translate';
import { QrCodeModalComponent } from '../../modals/qr-code-modal/qr-code-modal.component';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})
export class ContactsPage implements OnInit {
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

  async openScanModal() {
    const modal = await this.modalController.create({
      component: QrCodeModalComponent
    });

    return await modal.present();
  }

  async load() {
    this.contacts = await this.contactsService.getFromStorage();
    this.temp = this.contacts;

    this.ref.detectChanges();
  }

  async openContactsUpdateModal(contact, index) {
    const modal = await this.modalController.create({
      component: ContactsUpdatePage,
      componentProps: {
        'contact': contact,
        'index': index
      }
    });

    return await modal.present();
  }

  async openContactsCreateModal() {
    const modal = await this.modalController.create({
      component: ContactsCreatePage
    });

    return await modal.present();
  }

  ngOnDestroy() {
    this.subjects.contactsList && this.subjects.contactsList.unsubscribe();
    this.subjects.onUpdatedLanguage && this.subjects.onUpdatedLanguage.unsubscribe();
  }
}
