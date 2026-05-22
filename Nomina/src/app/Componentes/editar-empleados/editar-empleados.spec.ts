import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarEmpleados } from './editar-empleados';

describe('EditarEmpleados', () => {
  let component: EditarEmpleados;
  let fixture: ComponentFixture<EditarEmpleados>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarEmpleados]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarEmpleados);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
