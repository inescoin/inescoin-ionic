import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsCreatePage } from './contacts-create.page';

describe('ContactsCreatePage', () => {
  let component: ContactsCreatePage;
  let fixture: ComponentFixture<ContactsCreatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactsCreatePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactsCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
