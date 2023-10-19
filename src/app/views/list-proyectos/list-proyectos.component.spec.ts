import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListProyectosComponent } from './list-proyectos.component';

describe('ListProyectosComponent', () => {
  let component: ListProyectosComponent;
  let fixture: ComponentFixture<ListProyectosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListProyectosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListProyectosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
