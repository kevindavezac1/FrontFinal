import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerAgendaOperadorComponent } from './ver-agenda-operador.component';

describe('VerAgendaOperadorComponent', () => {
  let component: VerAgendaOperadorComponent;
  let fixture: ComponentFixture<VerAgendaOperadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerAgendaOperadorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerAgendaOperadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
