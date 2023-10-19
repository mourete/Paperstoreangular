import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListSucursalesComponent } from './list-sucursales.component';

describe('ListSucursalesComponent', () => {
  let component: ListSucursalesComponent;
  let fixture: ComponentFixture<ListSucursalesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSucursalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSucursalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
