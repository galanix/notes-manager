import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupFolderComponent } from './popup-folder.component';

describe('PopupFolderComponent', () => {
  let component: PopupFolderComponent;
  let fixture: ComponentFixture<PopupFolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupFolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
