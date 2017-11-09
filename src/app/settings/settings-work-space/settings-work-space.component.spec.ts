import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsWorkSpaceComponent } from './settings-work-space.component';

describe('SettingsWorkSpaceComponent', () => {
  let component: SettingsWorkSpaceComponent;
  let fixture: ComponentFixture<SettingsWorkSpaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsWorkSpaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsWorkSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
