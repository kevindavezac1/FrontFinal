import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearUsuarioOperadorComponent } from './crear-usuario-operador.component';

describe('CrearUsuarioOperadorComponent', () => {
  let component: CrearUsuarioOperadorComponent;
  let fixture: ComponentFixture<CrearUsuarioOperadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearUsuarioOperadorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearUsuarioOperadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
