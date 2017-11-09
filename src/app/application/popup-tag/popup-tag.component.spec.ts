import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupTagComponent } from './popup-tag.component';

describe('PopupTagComponent', () => {
  let component: PopupTagComponent;
  let fixture: ComponentFixture<PopupTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
