import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessengerPage } from './messenger.page';

describe('MessengerPage', () => {
  let component: MessengerPage;
  let fixture: ComponentFixture<MessengerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessengerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessengerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
