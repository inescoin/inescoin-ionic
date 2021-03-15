import { NgModule } from '@angular/core';
import { HttpModule, Http } from '@angular/http';
import { HttpClientModule, HttpClient  } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

import { DoorgetsTruncateModule } from 'doorgets-ng-truncate';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { DoorgetsTranslateModule , NgTranslate, NgTranslateAbstract } from 'doorgets-ng-translate';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { inescoinConfig } from '../config/inescoin.config';
import { SelectContactComponent } from './modals/select-contact/select-contact.component';
import { SelectAddressComponent } from './modals/select-address/select-address.component';
import { QrCodeModalComponent } from './modals/qr-code-modal/qr-code-modal.component';

import { ImportKeysComponent } from './modals/import-keys/import-keys.component';
import { ExportKeysComponent } from './modals/export-keys/export-keys.component';

import { ContactsCreatePage } from './account/contacts/contacts-create/contacts-create.page';

export function newNgTranslate(http: HttpClient) {
  return new NgTranslate(http, '../../assets/locale');
}

registerLocaleData(localeFr, 'fr');
import { Clipboard } from '@ionic-native/clipboard/ngx';

import { SharedModule } from './shared.module';


// const config: SocketIoConfig = { url: inescoinConfig.messengerAddress, options: {} };

@NgModule({
  declarations: [
    AppComponent,
    SelectContactComponent,
    ContactsCreatePage,
    QrCodeModalComponent,
    SelectAddressComponent,
    ImportKeysComponent,
    ExportKeysComponent,
  ],
  entryComponents: [
    SelectContactComponent,
    SelectAddressComponent,
    ContactsCreatePage,
    QrCodeModalComponent,
    ImportKeysComponent,
    ExportKeysComponent,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    NgxQRCodeModule,
    DoorgetsTruncateModule,
    FormsModule,
    ReactiveFormsModule,
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
    HttpClientModule,
    SharedModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ScreenOrientation,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Clipboard,
    QRScanner,
  ],
  exports: [
    SelectContactComponent,
    SelectAddressComponent,
    ImportKeysComponent,
    ExportKeysComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
