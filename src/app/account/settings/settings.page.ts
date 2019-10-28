import { Component, OnInit } from '@angular/core';
import { DoorgetsTranslateService } from 'doorgets-ng-translate';

import { ConfigService } from '../../services/config.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  chooseLanguage: string = 'en';

  subjects: any = {};

  constructor(
  	private languageService: LanguageService,
  	private configService: ConfigService,
    private doorgetsTranslateService: DoorgetsTranslateService) { }

  async ngOnInit() {
    this.subjects.onUpdatedLanguage = this.languageService.onUpdated.subscribe((langue) => {
      this.doorgetsTranslateService.setCurrent(langue);
    });

    this.chooseLanguage = await this.configService.getLanguage();
    this.doorgetsTranslateService.init({
      languages: ['en', 'fr', 'es'],
      current: this.chooseLanguage,
      default: this.chooseLanguage
    });
  }

  changeLanguage() {
    if (this.chooseLanguage) {
      this.doorgetsTranslateService.setCurrent(this.chooseLanguage);

      this.configService.setLanguage(this.chooseLanguage);
      this.languageService.onUpdated.emit(this.chooseLanguage);
    }
  }

  ngOnDestroy() {
    console.log('SettingsPage::destroy');
  }

}
