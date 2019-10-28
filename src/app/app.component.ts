import { Component } from '@angular/core';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { DoorgetsTranslateService } from 'doorgets-ng-translate';
import { ConfigService } from './services/config.service';
import { LanguageService } from './services/language.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public appPages = [
    {
      title: '#Wallets',
      url: '/wallet',
      icon: 'wallet',
      name: 'wallet'
    },
    {
      title: '#Send',
      url: '/send',
      icon: 'send',
      name: 'send'
    },
    {
      title: '#Contacts',
      url: '/contacts',
      icon: 'contacts',
      name: 'contacts'
    },
    {
      title: '#Settings',
      url: '/settings',
      icon: 'cog',
      name: 'settings'
    }
  ];

  constructor(
    private languageService: LanguageService,
    private configService: ConfigService,
    private doorgetsTranslateService: DoorgetsTranslateService,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private screenOrientation: ScreenOrientation
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

      this.statusBar.styleDefault();
      this.splashScreen.hide();

      let current = await this.configService.getLanguage();
      this.doorgetsTranslateService.init({
        languages: ['en', 'fr', 'es'],
        current: current,
        default: current
      });
    });
  }

  ngOnInit() {
    this.languageService.onUpdated.subscribe((langue) => {
      this.doorgetsTranslateService.setCurrent(langue);
    });
  }
}
