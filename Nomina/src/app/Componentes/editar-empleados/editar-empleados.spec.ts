import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { EditarEmpleados } from './editar-empleados';
import { Servidor } from '../../Servidor/servidor';
import { Empleado } from '../../Entidades/Empleado';
import Swal from 'sweetalert2';

describe('EditarEmpleados', () => {
  let component: EditarEmpleados;
  let fixture: ComponentFixture<EditarEmpleados>;
  let servidor: jasmine.SpyObj<Servidor>;
  let router: jasmine.SpyObj<Router>;

  const empleadoMock: Empleado = {
    idEmpleado: 1,
    nombre: 'Sebastián',
    apellido: 'Díaz',
    numEmpleado: '123',
    telefono: '5555555555',
    seccion: 'Sistemas',
    sueldo: '15000'
  };

  beforeEach(async () => {
    servidor = jasmine.createSpyObj<Servidor>(
      'Servidor',
      ['buscarEmpleados', 'guardarEmpleado']
    );

    router = jasmine.createSpyObj<Router>(
      'Router',
      ['navigate']
    );

    servidor.buscarEmpleados.and.returnValue(of(empleadoMock));

    spyOn(Swal, 'fire');
    spyOn(console, 'log');

    localStorage.setItem('empleado_key', '1');

    await TestBed.configureTestingModule({
      imports: [EditarEmpleados],
      providers: [
        { provide: Servidor, useValue: servidor },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditarEmpleados);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.removeItem('empleado_key');
  });

  it('Debería crear', () => {
    expect(component).toBeTruthy();
  });

  it('Debe cargar los datos del empleado', () => {
    expect(servidor.buscarEmpleados).toHaveBeenCalledWith('1');
    expect(component.empleado.numEmpleado).toBe('123');
    expect(component.empleado.nombre).toBe('Sebastián');
  });
});
