import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarTurnosOperadorComponent } from './asignar-turnos-operador.component';

describe('AignarTurnosOperadorComponent', () => {
  let component: AsignarTurnosOperadorComponent;
  let fixture: ComponentFixture<AsignarTurnosOperadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsignarTurnosOperadorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignarTurnosOperadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
