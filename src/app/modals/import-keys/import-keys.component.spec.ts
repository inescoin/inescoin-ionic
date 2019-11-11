import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportKeysComponent } from './import-keys.component';

describe('ImportKeysComponent', () => {
  let component: ImportKeysComponent;
  let fixture: ComponentFixture<ImportKeysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportKeysComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportKeysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
