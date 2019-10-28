import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SettingsMessengerPage } from './settings-messenger.page';

const routes: Routes = [
  {
    path: '',
    component: SettingsMessengerPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SettingsMessengerPage]
})
export class SettingsMessengerPageModule {}
