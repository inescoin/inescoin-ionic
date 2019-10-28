import { Injectable, EventEmitter } from '@angular/core';
import { inescoinConfig } from '../../config/inescoin.config';


@Injectable({
  providedIn: 'root'
})
export class LanguageService {
	onUpdated: EventEmitter<any> = new EventEmitter();
	constructor() {}
}
