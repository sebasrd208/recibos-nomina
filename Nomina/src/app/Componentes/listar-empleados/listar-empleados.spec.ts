import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ListarEmpleados } from './listar-empleados';
import { Servidor } from '../../Servidor/servidor';
import { AuthService } from '../../Servidor/auth.service';
import { Empleado } from '../../Entidades/Empleado';
import Swal from 'sweetalert2';

describe('ListarEmpleados', () => {
  let component: ListarEmpleados;
  let fixture: ComponentFixture<ListarEmpleados>;
  let servidor: jasmine.SpyObj<Servidor>;
  let auth: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  const empleadosMock: Empleado[] = [
    {
      idEmpleado: 2,
      nombre: 'Carlos',
      apellido: 'Lopez',
      numEmpleado: '102',
      seccion: 'Ventas'
    } as Empleado,
    {
      idEmpleado: 1,
      nombre: 'Ana',
      apellido: 'Perez',
      numEmpleado: '101',
      seccion: 'Sistemas'
    } as Empleado
  ];

  beforeEach(async () => {
    servidor = jasmine.createSpyObj<Servidor>(
      'Servidor',
      ['listarEmpleados', 'eliminar', 'obtenerPDF']
    );

    servidor.listarEmpleados.and.returnValue(of(empleadosMock));
    servidor.eliminar.and.returnValue(of({}));

    servidor.obtenerPDF.and.returnValue(
      of(new Blob(['PDF de prueba'], { type: 'application/pdf' }))
    );

    auth = jasmine.createSpyObj<AuthService>(
      'AuthService',
      ['isAdmin']
    );
    auth.isAdmin.and.returnValue(true);

    router = jasmine.createSpyObj<Router>('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ListarEmpleados],
      providers: [
        { provide: Servidor, useValue: servidor },
        { provide: AuthService, useValue: auth },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    spyOn(console, 'log');

    fixture = TestBed.createComponent(ListarEmpleados);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Debería crear', () => {
    expect(component).toBeTruthy();
  });

  it('Debe cargar los empleados y obtener las secciones', () => {
    expect(servidor.listarEmpleados).toHaveBeenCalled();
    expect(component.empleados).toEqual(empleadosMock);
    expect(component.secciones).toEqual(['Ventas', 'Sistemas']);
  });

  it('Debe ordenar los empleados por nombre de forma ascendente', () => {
    component.empleados = [...empleadosMock];

    component.ordenarEmpleados('nombre');

    expect(component.empleados[0].nombre).toBe('Ana');
    expect(component.empleados[1].nombre).toBe('Carlos');
    expect(component.sortDirection).toBe('asc');
  });

  it('Debe invertir el orden al seleccionar nuevamente la columna', () => {
    component.empleados = [...empleadosMock];

    component.ordenarEmpleados('nombre');
    component.ordenarEmpleados('nombre');

    expect(component.empleados[0].nombre).toBe('Carlos');
    expect(component.empleados[1].nombre).toBe('Ana');
    expect(component.sortDirection).toBe('desc');
  });

  it('Debe filtrar los empleados por sección', () => {
    component.filtroSeccion = 'Ventas';

    expect(component.empleadosFiltrados().length).toBe(1);
    expect(component.empleadosFiltrados()[0].nombre).toBe('Carlos');
    expect(component.totalFiltradosEmpleados).toBe(1);
    expect(component.textoFiltroEmpleados).toBe('Ventas: 1');
  });

  it('Debe navegar al editar un empleado', () => {
    component.editar(empleadosMock[0]);

    expect(localStorage.getItem('empleado_key')).toBe('102');
    expect(router.navigate).toHaveBeenCalledWith(['editar-empleados']);
  });

  it('Debe consultar si el usuario es administrador', () => {
    expect(component.isAdmin()).toBeTrue();
    expect(auth.isAdmin).toHaveBeenCalled();
  });

  it('Debe mostrar un error si falla la carga de empleados', () => {
    servidor.listarEmpleados.and.returnValue(
      throwError(() => new Error('Error de prueba'))
    );

    const swalSpy = spyOn(Swal, 'fire');

    component.listar();

    expect(swalSpy).toHaveBeenCalledWith(
      'Error',
      'No se pudieron cargar los empleados',
      'error'
    );
  });
});
