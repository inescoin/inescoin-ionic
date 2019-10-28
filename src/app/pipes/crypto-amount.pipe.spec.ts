import { CryptoAmountPipe } from './crypto-amount.pipe';

describe('CryptoAmountPipe', () => {
  it('create an instance', () => {
    const pipe = new CryptoAmountPipe();
    expect(pipe).toBeTruthy();
  });
});
