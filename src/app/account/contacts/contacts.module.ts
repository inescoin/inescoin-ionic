import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpModule, Http } from '@angular/http';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { Clipboard } from '@ionic-native/clipboard/ngx';

import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';

import { ContactsPage } from './contacts.page';

import { DoorgetsTruncateModule } from 'doorgets-ng-truncate';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { DoorgetsTranslateModule , NgTranslate, NgTranslateAbstract } from 'doorgets-ng-translate';

import { ContactsCreatePage } from './contacts-create/contacts-create.page';
import { ContactsDetailsPage } from './contacts-details/contacts-details.page';
import { ContactsUpdatePage } from './contacts-update/contacts-update.page';
// import { QrCodeModalComponent } from '../../modals/qr-code-modal/qr-code-modal.component';

export function newNgTranslate(http: Http) {
  return new NgTranslate(http, '../../assets/locale');
}

registerLocaleData(localeFr, 'fr');

const routes: Routes = [
  {
    path: '',
    component: ContactsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    NgxQRCodeModule,
    DoorgetsTruncateModule,
    HttpModule,
    DoorgetsTranslateModule,
    DoorgetsTranslateModule.forRoot({
      provide: NgTranslateAbstract,
      useFactory: (newNgTranslate),
      deps: [Http]
    }),
    IonicStorageModule.forRoot({
      name: '__inescoin',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
  ],
  entryComponents: [
    // ContactsCreatePage,
    ContactsDetailsPage,
    ContactsUpdatePage,
    // QrCodeModalComponent
  ],
  declarations: [
    ContactsPage,
    // ContactsCreatePage,
    ContactsDetailsPage,
    ContactsUpdatePage,
    // QrCodeModalComponent
  ],
  providers: [
    QRScanner,
    Clipboard
  ]
})
export class ContactsPageModule {}
