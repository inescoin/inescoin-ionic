import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { DoorgetsTranslateModule , NgTranslate, NgTranslateAbstract } from 'doorgets-ng-translate';
import { HttpModule, Http } from '@angular/http';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

import { IonicModule } from '@ionic/angular';

import { SendPage } from './send.page';

export function newNgTranslate(http: Http) {
  return new NgTranslate(http, '../../assets/locale');
}

registerLocaleData(localeFr, 'fr');

const routes: Routes = [
  {
    path: '',
    component: SendPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    HttpModule,
    DoorgetsTranslateModule,
    DoorgetsTranslateModule.forRoot({
      provide: NgTranslateAbstract,
      useFactory: (newNgTranslate),
      deps: [Http]
    }),
  ],
  entryComponents: [
  ],
  declarations: [
    SendPage,
  ]
})
export class SendPageModule {}
