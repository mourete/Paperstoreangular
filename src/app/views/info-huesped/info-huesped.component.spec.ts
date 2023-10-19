import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InfoHuespedComponent } from './info-huesped.component';

describe('InfoHuespedComponent', () => {
  let component: InfoHuespedComponent;
  let fixture: ComponentFixture<InfoHuespedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoHuespedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoHuespedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
