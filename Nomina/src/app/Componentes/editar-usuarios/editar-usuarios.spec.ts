import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { EditarUsuarios } from './editar-usuarios';
import { AuthService } from '../../Servidor/auth.service';
import { Rol } from '../../Entidades/Usuarios';
import Swal from 'sweetalert2';

describe('EditarUsuarios', () => {
  let component: EditarUsuarios;
  let fixture: ComponentFixture<EditarUsuarios>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj<AuthService>(
      'AuthService',
      ['buscarUsuarios', 'editar']
    );

    router = jasmine.createSpyObj<Router>(
      'Router',
      ['navigate']
    );

    authService.buscarUsuarios.and.returnValue(
      of({
        idUsuario: 1,
        usuario: 'sebas',
        password: '',
        nombreCompleto: 'Sebastián',
        rol: Rol.USER
      })
    );

    spyOn(Swal, 'fire');
    spyOn(console, 'log');

    await TestBed.configureTestingModule({
      imports: [EditarUsuarios],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditarUsuarios);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Debería crear', () => {
    expect(component).toBeTruthy();
  });

  it('Debe cargar los datos del usuario', () => {
    expect(authService.buscarUsuarios).toHaveBeenCalled();
    expect(component.usuario.usuario).toBe('sebas');
    expect(component.usuario.nombreCompleto).toBe('Sebastián');
  });
});

