import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ListarCompanias } from './listar-companias';
import { Servidor } from '../../Servidor/servidor';
import { Compania } from '../../Entidades/Empleado';
import Swal from 'sweetalert2';

describe('ListarCompanias', () => {
  let component: ListarCompanias;
  let fixture: ComponentFixture<ListarCompanias>;
  let servidor: jasmine.SpyObj<Servidor>;
  let router: jasmine.SpyObj<Router>;

  const companiasMock: Compania[] = [];

  beforeEach(async () => {
    servidor = jasmine.createSpyObj<Servidor>(
      'Servidor',
      ['listarCompanias', 'eliminar']
    );

    router = jasmine.createSpyObj<Router>('Router', ['navigate']);

    servidor.listarCompanias.and.returnValue(of(companiasMock));
    servidor.eliminar.and.returnValue(of({}));

    spyOn(Swal, 'fire');
    spyOn(console, 'log');

    await TestBed.configureTestingModule({
      imports: [ListarCompanias],
      providers: [
        { provide: Servidor, useValue: servidor },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListarCompanias);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Debería crear', () => {
    expect(component).toBeTruthy();
  });

  it('Debe consultar las compañías al inicializar', () => {
    expect(servidor.listarCompanias).toHaveBeenCalled();
    expect(component.companias).toEqual([]);
  });

  it('Debe ordenar las compañías por idCompania en orden descendente', () => {
    component.companias = [
      { idCompania: 1, numEmpleado: 'A', nombre: 'Alfa' } as Compania,
      { idCompania: 2, numEmpleado: 'B', nombre: 'Beta' } as Compania
    ];

    component.ordenarCompanias('idCompania');

    expect(component.companias[0].idCompania).toBe(2);
    expect(component.companias[1].idCompania).toBe(1);
    expect(component.sortColumn).toBe('idCompania');
    expect(component.sortDirection).toBe('desc');
  });
});
