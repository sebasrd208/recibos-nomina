import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ListarDocumentos } from './listar-documentos';
import { Servidor } from '../../Servidor/servidor';
import { Documento } from '../../Entidades/Documento';
import Swal from 'sweetalert2';

describe('ListarDocumentos', () => {
  let component: ListarDocumentos;
  let fixture: ComponentFixture<ListarDocumentos>;
  let servidor: jasmine.SpyObj<Servidor>;
  let router: jasmine.SpyObj<Router>;

  const documentosMock: Documento[] = [
    {
      idDocumento: 1,
      nombre: 'Ana',
      apellido: 'López',
      documento: 'Recibo',
      numEmpleado: '100',
      correo: 'ana@prueba.com',
      status: '0'
    },
    {
      idDocumento: 2,
      nombre: 'Luis',
      apellido: 'Pérez',
      documento: 'Recibo',
      numEmpleado: '200',
      correo: 'luis@prueba.com',
      status: '1'
    }
  ];

  beforeEach(async () => {
    servidor = jasmine.createSpyObj<Servidor>(
      'Servidor',
      [
        'listarDocumentos',
        'eliminar',
        'enviarCorreo',
        'enviarCorreosPendientes'
      ]
    );

    servidor.listarDocumentos.and.returnValue(of(documentosMock));
    servidor.eliminar.and.returnValue(of({}));
    servidor.enviarCorreo.and.returnValue(of({
      numEmpleado: '100',
      correoEnviado: 'ana@prueba.com',
      tiempoEjecucionMs: 120
    }));

    servidor.enviarCorreosPendientes.and.returnValue(of({
      correosEnviados: ['ana@prueba.com'],
      correosFallidos: [],
      totalEnviados: 1,
      totalFallidos: 0,
      tiempoEjecucionMs: 120
    }));

    router = jasmine.createSpyObj<Router>('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ListarDocumentos],
      providers: [
        { provide: Servidor, useValue: servidor },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListarDocumentos);
    component = fixture.componentInstance;

    spyOn(Swal, 'fire').and.returnValue(
      Promise.resolve({ isConfirmed: false } as any)
    );
    spyOn(Swal, 'showLoading');
    spyOn(console, 'log');
    spyOn(console, 'error');

    fixture.detectChanges();
  });

  it('Debería crear', () => {
    expect(component).toBeTruthy();
  });

  it('Debe cargar los documentos al iniciar', () => {
    expect(servidor.listarDocumentos).toHaveBeenCalled();
    expect(component.documentos.length).toBe(2);
  });

  it('Debe mostrar un error si falla la carga', () => {
    servidor.listarDocumentos.and.returnValue(
      throwError(() => new Error('Error de prueba'))
    );

    component.listar();

    expect(Swal.fire).toHaveBeenCalledWith(
      'Error',
      'No se pudieron cargar los documentos',
      'error'
    );
  });

  it('Debe detectar documentos pendientes', () => {
    expect(component.hayPendientes()).toBeTrue();
  });

  it('Debe devolver false si no hay documentos pendientes', () => {
    component.documentos = [
      { ...documentosMock[1], status: '1' }
    ];

    expect(component.hayPendientes()).toBeFalse();
  });

  it('Debe ordenar los documentos por identificador', () => {
    component.ordenarDocumentos('idDocumento');

    expect(component.documentos[0].idDocumento).toBe(2);
    expect(component.sortDirection).toBe('desc');
  });

  it('Debe filtrar los documentos por estado', () => {
    component.filtroEstado = '0';

    expect(component.documentosFiltrados().length).toBe(1);
    expect(component.documentosFiltrados()[0].numEmpleado).toBe('100');
  });

  it('Debe mostrar el total de documentos filtrados', () => {
    component.filtroEstado = '1';

    expect(component.totalFiltradosDocumentos).toBe(1);
    expect(component.textoFiltroDocumentos).toBe('Enviados: 1');
  });

  it('Debe navegar al registro de documentos', () => {
    component.guardar();

    expect(router.navigate).toHaveBeenCalledWith(['guardar-documentos']);
  });

  it('Debe guardar el empleado y navegar para editar', () => {
    localStorage.removeItem('documento_key');

    component.editar(documentosMock[0]);

    expect(localStorage.getItem('documento_key')).toBe(
      documentosMock[0].numEmpleado
    );
    expect(router.navigate).toHaveBeenCalledWith(['editar-documentos']);

    localStorage.removeItem('documento_key');
  });

  it('Debe enviar un correo y actualizar la lista', () => {
    component.enviar('100');

    expect(servidor.enviarCorreo).toHaveBeenCalledWith('100');
    expect(component.resultado?.numEmpleado).toBe('100');
    expect(servidor.listarDocumentos).toHaveBeenCalledTimes(2);
  });

  it('Debe enviar los correos pendientes', () => {
    component.enviarPendientes();

    expect(servidor.enviarCorreosPendientes).toHaveBeenCalled();
    expect(servidor.listarDocumentos).toHaveBeenCalledTimes(2);
  });
});
