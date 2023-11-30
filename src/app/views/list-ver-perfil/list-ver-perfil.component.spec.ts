import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListVerPerfilComponent } from './list-ver-perfil.component';

describe('ListVerPerfilComponent', () => {
  let component: ListVerPerfilComponent;
  let fixture: ComponentFixture<ListVerPerfilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListVerPerfilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListVerPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
