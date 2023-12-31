import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListEmpresasComponent } from './list-empresas.component';

describe('ListEmpresasComponent', () => {
  let component: ListEmpresasComponent;
  let fixture: ComponentFixture<ListEmpresasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListEmpresasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmpresasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
