// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Routes, RouterModule } from '@angular/router';
// import { HttpModule, Http } from '@angular/http';
// import { registerLocaleData } from '@angular/common';
// import localeFr from '@angular/common/locales/fr';

// import { IonicModule } from '@ionic/angular';
// import { IonicStorageModule } from '@ionic/storage';

// import { DoorgetsTruncateModule } from 'doorgets-ng-truncate';
// import { NgxQRCodeModule } from 'ngx-qrcode2';
// import { ZXingScannerModule } from '@zxing/ngx-scanner';
// import { DoorgetsTranslateModule , NgTranslate, NgTranslateAbstract } from 'doorgets-ng-translate';

// import { WalletCreatePage } from './wallet-create.page';
// import { WalletService } from '../../../services/wallet.service';

// export function newNgTranslate(http: Http) {
//   return new NgTranslate(http, '../../assets/locale');
// }

// registerLocaleData(localeFr, 'fr');

// const routes: Routes = [
//   {
//     path: '',
//     component: WalletCreatePage
//   }
// ];

// @NgModule({
//   imports: [
//     CommonModule,
//     FormsModule,
//     IonicModule,
//     RouterModule.forChild(routes),
//     NgxQRCodeModule,
//     ZXingScannerModule,
//     DoorgetsTruncateModule,
//     HttpModule,
//     DoorgetsTranslateModule,
//     DoorgetsTranslateModule.forRoot({
//       provide: NgTranslateAbstract,
//       useFactory: (newNgTranslate),
//       deps: [Http]
//     }),
//     IonicStorageModule.forRoot({
//       name: '__mydb',
//       driverOrder: ['indexeddb', 'sqlite', 'websql']
//     }),
//   ],
//   providers: [
//     WalletService,
//   ],
//   declarations: [WalletCreatePage]
// })
// export class WalletCreatePageModule {}
