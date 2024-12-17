import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionEspecialidadComponent } from './gestion-especialidad.component';

describe('GestionEspecialidadComponent', () => {
  let component: GestionEspecialidadComponent;
  let fixture: ComponentFixture<GestionEspecialidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionEspecialidadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionEspecialidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
