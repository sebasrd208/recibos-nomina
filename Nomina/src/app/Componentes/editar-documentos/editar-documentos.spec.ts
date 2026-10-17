
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import Swal from 'sweetalert2';

import { EditarDocumentos } from './editar-documentos';
import { Servidor } from '../../Servidor/servidor';

describe('EditarDocumentos', () => {
  let component: EditarDocumentos;
  let fixture: ComponentFixture<EditarDocumentos>;
  let servidor: jasmine.SpyObj<Servidor>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    servidor = jasmine.createSpyObj<Servidor>(
      'Servidor',
      ['buscarDocumento', 'guardarDocumento']
    );

    router = jasmine.createSpyObj<Router>('Router', ['navigate']);

    servidor.buscarDocumento.and.returnValue(of({
      idDocumento: 1,
      nombre: 'Usuario',
      apellido: 'Prueba',
      documento: 'Recibo',
      numEmpleado: '100',
      correo: 'usuario@prueba.com',
      status: '1'
    }));

    servidor.guardarDocumento.and.returnValue(of({
      idDocumento: 1,
      nombre: 'Usuario',
      apellido: 'Prueba',
      documento: 'Recibo',
      numEmpleado: '100',
      correo: 'usuario@prueba.com',
      status: '0'
    }));

    spyOn(Swal, 'fire');
    spyOn(console, 'log');

    await TestBed.configureTestingModule({
      imports: [EditarDocumentos],
      providers: [
        { provide: Servidor, useValue: servidor },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditarDocumentos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Debería crear', () => {
    expect(component).toBeTruthy();
  });

  it('Debe buscar el documento al inicializar', () => {
    expect(servidor.buscarDocumento).toHaveBeenCalled();
    expect(component.document.numEmpleado).toBe('100');
  });
});
