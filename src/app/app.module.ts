import { NgModule } from '@angular/core';
import { HttpModule, Http } from '@angular/http';
import { HttpClientModule  } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

import { DoorgetsTruncateModule } from 'doorgets-ng-truncate';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
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
import { QrCodeModalComponent } from './modals/qr-code-modal/qr-code-modal.component';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';

import { ContactsCreatePage } from './account/contacts/contacts-create/contacts-create.page';

export function newNgTranslate(http: Http) {
  return new NgTranslate(http, '../../assets/locale');
}
import { Clipboard } from '@ionic-native/clipboard/ngx';

registerLocaleData(localeFr, 'fr');

// const config: SocketIoConfig = { url: inescoinConfig.messengerAddress, options: {} };

@NgModule({
  declarations: [AppComponent, SelectContactComponent, ContactsCreatePage, QrCodeModalComponent],
  entryComponents: [SelectContactComponent, ContactsCreatePage, QrCodeModalComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    NgxQRCodeModule,
    ZXingScannerModule,
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
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
