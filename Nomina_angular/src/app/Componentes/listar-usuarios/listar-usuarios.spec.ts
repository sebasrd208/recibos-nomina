
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { ListarUsuarios } from './listar-usuarios';
import { AuthService } from '../../Servidor/auth.service';

describe('ListarUsuarios', () => {
  let component: ListarUsuarios;
  let fixture: ComponentFixture<ListarUsuarios>;
  let authSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj<AuthService>(
      'AuthService',
      ['listarUsuarios', 'getUser', 'eliminar']
    );

    authSpy.listarUsuarios.and.returnValue(of([]));
    authSpy.getUser.and.returnValue(null);

    routerSpy = jasmine.createSpyObj<Router>(
      'Router',
      ['navigate']
    );

    await TestBed.configureTestingModule({
      imports: [ListarUsuarios],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListarUsuarios);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Debería crear', () => {
    expect(component).toBeTruthy();
  });
});
