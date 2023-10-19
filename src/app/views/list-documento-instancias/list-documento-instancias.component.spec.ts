import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListDocumentoInstanciasComponent } from './list-documento-instancias.component';

describe('ListDocumentoInstanciasComponent', () => {
  let component: ListDocumentoInstanciasComponent;
  let fixture: ComponentFixture<ListDocumentoInstanciasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListDocumentoInstanciasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDocumentoInstanciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
