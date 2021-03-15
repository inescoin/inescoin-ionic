import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'wallet',
    pathMatch: 'full'
  },
  { path: 'wallet', loadChildren: () => import('./account/wallet/wallet.module').then(m => m.WalletPageModule) },
  { path: 'contacts', loadChildren: () => import('./account/contacts/contacts.module').then(m => m.ContactsPageModule) },
  { path: 'messenger', loadChildren: () => import('./account/messenger/messenger.module').then(m => m.MessengerPageModule) },
  { path: 'settings', loadChildren: () => import('./account/settings/settings.module').then(m => m.SettingsPageModule) },
  { path: 'send', loadChildren: () => import('./account/send/send.module').then(m => m.SendPageModule) },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
