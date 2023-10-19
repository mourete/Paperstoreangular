import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UsuarioMarcasComponent } from './usuario-marcas.component';

describe('UsuarioMarcasComponent', () => {
  let component: UsuarioMarcasComponent;
  let fixture: ComponentFixture<UsuarioMarcasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UsuarioMarcasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuarioMarcasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
