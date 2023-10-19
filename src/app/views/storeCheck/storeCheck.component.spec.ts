import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StoreCheckComponent } from './storeCheck.component';

describe('StoreCheckComponent', () => {
  let component: StoreCheckComponent;
  let fixture: ComponentFixture<StoreCheckComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
