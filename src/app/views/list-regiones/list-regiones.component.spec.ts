import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListRegionesComponent } from './list-regiones.component';

describe('ListRegionesComponent', () => {
  let component: ListRegionesComponent;
  let fixture: ComponentFixture<ListRegionesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListRegionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListRegionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
