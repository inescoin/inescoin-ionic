import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpModule, Http } from '@angular/http';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';

import { SocialSharing } from '@ionic-native/social-sharing/ngx';

import { DoorgetsTruncateModule } from 'doorgets-ng-truncate';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { DoorgetsTranslateModule , NgTranslate, NgTranslateAbstract } from 'doorgets-ng-translate';
import { Clipboard } from '@ionic-native/clipboard/ngx';

import { WalletPage } from './wallet.page';
import { WalletCreatePage } from './wallet-create/wallet-create.page';
import { WalletSendPage } from './wallet-send/wallet-send.page';
import { WalletAccountPage } from './wallet-account/wallet-account.page';
import { WalletImportPage } from './wallet-import/wallet-import.page';
import { WalletTransferPage } from './wallet-account/wallet-transfer/wallet-transfer.page';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { PasswordStrengthBarModule } from 'ng2-password-strength-bar';

export function newNgTranslate(http: Http) {
  return new NgTranslate(http, '../../assets/locale');
}

registerLocaleData(localeFr, 'fr');

import { CryptoAmountPipe } from '../../pipes/crypto-amount.pipe';
import { inescoinConfig } from '../../../config/inescoin.config';

const config: SocketIoConfig = { url: inescoinConfig.messengerAddress, options: {} };

const routes: Routes = [
  {
    path: '',
    component: WalletPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    NgxQRCodeModule,
    ZXingScannerModule,
    DoorgetsTruncateModule,
    HttpModule,
    DoorgetsTranslateModule,
    DoorgetsTranslateModule.forRoot({
      provide: NgTranslateAbstract,
      useFactory: (newNgTranslate),
      deps: [Http]
    }),
    SocketIoModule,
    PasswordStrengthBarModule,
    IonicStorageModule.forRoot({
      name: '__inescoin',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
  ],
  providers: [
    Clipboard,
    SocialSharing
  ],
  entryComponents: [
    WalletCreatePage,
    WalletAccountPage,
    WalletImportPage,
    WalletSendPage,
    WalletTransferPage,
  ],
  declarations: [
    WalletPage,
    WalletCreatePage,
    WalletAccountPage,
    WalletTransferPage,
    WalletImportPage,
    WalletSendPage,
    CryptoAmountPipe,
  ]
})
export class WalletPageModule {}
