import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportKeysComponent } from './export-keys.component';

describe('ExportKeysComponent', () => {
  let component: ExportKeysComponent;
  let fixture: ComponentFixture<ExportKeysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportKeysComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportKeysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
