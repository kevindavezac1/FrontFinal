import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearUserAdminComponent } from './crear-user-admin.component';

describe('CrearUserAdminComponent', () => {
  let component: CrearUserAdminComponent;
  let fixture: ComponentFixture<CrearUserAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearUserAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearUserAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
