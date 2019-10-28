import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'wallet',
    pathMatch: 'full'
  },
  { path: 'wallet', loadChildren: './account/wallet/wallet.module#WalletPageModule' },
  { path: 'contacts', loadChildren: './account/contacts/contacts.module#ContactsPageModule' },
  { path: 'messenger', loadChildren: './account/messenger/messenger.module#MessengerPageModule' },
  { path: 'settings', loadChildren: './account/settings/settings.module#SettingsPageModule' },
  { path: 'send', loadChildren: './account/send/send.module#SendPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
