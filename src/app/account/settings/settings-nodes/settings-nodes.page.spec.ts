import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsNodesPage } from './settings-nodes.page';

describe('SettingsNodesPage', () => {
  let component: SettingsNodesPage;
  let fixture: ComponentFixture<SettingsNodesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsNodesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsNodesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
