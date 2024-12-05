import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionCoberturasComponent } from './gestion-coberturas.component';

describe('GestionCoberturasComponent', () => {
  let component: GestionCoberturasComponent;
  let fixture: ComponentFixture<GestionCoberturasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionCoberturasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionCoberturasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
