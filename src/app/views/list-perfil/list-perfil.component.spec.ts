import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListPerfilComponent } from './list-perfil.component';

describe('ListEmpresasComponent', () => {
  let component: ListPerfilComponent;
  let fixture: ComponentFixture<ListPerfilComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPerfilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
