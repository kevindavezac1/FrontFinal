import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearUserOperadorComponent } from './crear-user-admin.component';

describe('CrearUserAdminComponent', () => {
  let component: CrearUserOperadorComponent;
  let fixture: ComponentFixture<CrearUserOperadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearUserOperadorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearUserOperadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
