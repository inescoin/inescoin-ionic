import { TestBed, inject } from '@angular/core/testing';

import { QrScannerService } from './qr-scanner.service';

describe('QpScannerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QrScannerService]
    });
  });

  it('should be created', inject([QrScannerService], (service: QrScannerService) => {
    expect(service).toBeTruthy();
  }));
});
