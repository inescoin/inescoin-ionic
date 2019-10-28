import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessengerChatPage } from './messenger-chat.page';

describe('MessengerChatPage', () => {
  let component: MessengerChatPage;
  let fixture: ComponentFixture<MessengerChatPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessengerChatPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessengerChatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
