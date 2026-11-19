import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { EditarCompanias } from './editar-companias';
import { Servidor } from '../../Servidor/servidor';
import { Compania } from '../../Entidades/Empleado';

describe('EditarCompanias', () => {
  let component: EditarCompanias;
  let fixture: ComponentFixture<EditarCompanias>;
  let servidor: jasmine.SpyObj<Servidor>;
  let router: jasmine.SpyObj<Router>;

  const companiaMock: Compania = {
    idCompania: 1,
    nombre: 'Sebastian',
    apellido: 'Diaz',
    numEmpleado: '100',
    rfc: 'DISS900101ABC',
    compania: 'Empresa de prueba',
    nota: 'Nota de prueba',
    trimestre: 'Primer trimestre'
  };

  beforeEach(async () => {
    servidor = jasmine.createSpyObj<Servidor>(
      'Servidor',
      ['buscarCompania', 'guardarCompania']
    );

    servidor.buscarCompania.and.returnValue(of(companiaMock));
    servidor.guardarCompania.and.returnValue(of(companiaMock));

    router = jasmine.createSpyObj<Router>('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [EditarCompanias],
      providers: [
        { provide: Servidor, useValue: servidor },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    spyOn(console, 'log');

    fixture = TestBed.createComponent(EditarCompanias);
    component = fixture.componentInstance;

    localStorage.setItem('compania_key', '1');

    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.removeItem('compania_key');
  });

  it('Debería crear', () => {
    expect(component).toBeTruthy();
  });

  it('Debe buscar y cargar los datos de la compañía', () => {
    expect(servidor.buscarCompania).toHaveBeenCalledWith('1');
    expect(component.company).toEqual(companiaMock);
  });

  it('Debe actualizar la compañía cuando los campos están completos', () => {
    component.company = { ...companiaMock };

    component.editar();

    expect(servidor.guardarCompania).toHaveBeenCalledWith(companiaMock);
    expect(router.navigate).toHaveBeenCalledWith(['listar-companias']);
  });

  it('No debe actualizar la compañía si faltan campos obligatorios', () => {
    component.company = {
      ...companiaMock,
      nombre: ''
    };

    component.editar();

    expect(servidor.guardarCompania).not.toHaveBeenCalled();
  });

  it('Debe navegar a listar compañías al cancelar', () => {
    component.cancelar();

    expect(router.navigate).toHaveBeenCalledWith(['listar-companias']);
  });
});
