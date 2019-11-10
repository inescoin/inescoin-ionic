import { NgModule, ModuleWithProviders } from '@angular/core';
import { CryptoAmountPipe } from './pipes/crypto-amount.pipe';

@NgModule({
  declarations: [
    CryptoAmountPipe
  ],
  exports: [
    CryptoAmountPipe
  ]
})
export class SharedModule {
}
