import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QrScannerService {

	onScan: EventEmitter<any> = new EventEmitter();

  constructor() { }
}
