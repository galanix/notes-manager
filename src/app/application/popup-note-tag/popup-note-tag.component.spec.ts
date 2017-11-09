import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupNoteTagComponent } from './popup-note-tag.component';

describe('PopupNoteTagComponent', () => {
  let component: PopupNoteTagComponent;
  let fixture: ComponentFixture<PopupNoteTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupNoteTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupNoteTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
