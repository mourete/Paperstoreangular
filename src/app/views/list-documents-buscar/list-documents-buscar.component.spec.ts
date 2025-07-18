import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListDocumentsBuscarComponent } from './list-documents-buscar.component';

describe('ListDocumentsBuscarComponent', () => {
  let component: ListDocumentsBuscarComponent;
  let fixture: ComponentFixture<ListDocumentsBuscarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListDocumentsBuscarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDocumentsBuscarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
