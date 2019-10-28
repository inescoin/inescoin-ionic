import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsMessengerPage } from './settings-messenger.page';

describe('SettingsMessengerPage', () => {
  let component: SettingsMessengerPage;
  let fixture: ComponentFixture<SettingsMessengerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsMessengerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsMessengerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
