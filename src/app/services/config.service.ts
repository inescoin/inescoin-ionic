import { Injectable } from '@angular/core';
import { inescoinConfig } from '../../config/inescoin.config';

import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

	constructor(private storage: Storage) {
	}

	setLanguage(langue) {
		this.storage.set(inescoinConfig.name + '-languge', langue);
	}

	async getLanguage() {
		return await this.storage.get(inescoinConfig.name + '-languge') || 'en';
	}
}
